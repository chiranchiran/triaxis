// UploadResource.jsx
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  Form,
  Input,
  Select,
  Upload,
  Tag,
  Row,
  Col,
  InputNumber,
  Radio,
  Divider,
  Checkbox,
  Cascader,
  Typography,
} from 'antd';
import {
  FolderOutlined,
} from '@ant-design/icons';
import MDEditor from '@uiw/react-md-editor';
import './index.less'
import { MyButton, OrderButton } from '../../components/MyButton';
import { Link } from 'react-router-dom';
import { logger } from '../../utils/logger';
import { ResetConfirmButton, SubmitConfirmButton, useToggleConfirm } from '../../components/Mymodal';
import { useGetResourceTypes, useGetSecondaryCategory, useUploadResource } from '../../hooks/api/resources';
import { useGetCourseTypes, useUploadCourse } from '../../hooks/api/courses';
import { useQueryClient } from '@tanstack/react-query';
import { UploadFiles } from '../../components/UploadFiles';
import { getFile, normFile } from '../../utils/commonUtil';

const { Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const UploadResource = () => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const toggleModal = useToggleConfirm();
  const { mutate: doUploadResource, isSuccess: resourceSuccess } = useUploadResource();
  const { mutate: doUploadCourse, isSuccess: courseSuccess } = useUploadCourse();
  /**
   *  state管理
   */
  const [type, setType] = useState(1);
  const [fileList, setFileList] = useState([]);
  const [tagState, setTagState] = useState({
    tags: [],
    inputValue: ''
  });
  const { tags, inputValue } = tagState;

  const [selectedTypes, setSelectedTypes] = useState({
    subjectId: null,
    parentId: null
  })
  /**
 *  获取数据
 */
  //获取资源数据学科、工具、一级分类
  const { data: resourceTypes = {}, isError: resourceTypesError } = useGetResourceTypes({ enabled: type === 1 });
  const { subjects: resourceSubjects = [], tools = [], categoriesFirst = [] } = resourceTypes || {}
  //根据资源学科和一级分类获取二级分类
  const { data: categoriesSecondaryData = [], isError: secondaryError, } = useGetSecondaryCategory({
    subjectId: selectedTypes.subjectId,
    parentId: selectedTypes.parentId
  }, { enabled: !!selectedTypes.subjectId && !!selectedTypes.parentId && type == 1 });
  //获取课程学科、难度、分类
  const { data: courseTypes = {}, isError: courseError } = useGetCourseTypes({ enabled: type === 2 });
  const { sujects: courseSubjects = [], categories = [] } = courseTypes || {}

  /**
   * 数据处理
   */

  //级联选择数据
  const categoryTreeData = useMemo(() => {
    if (type === 1) {
      return categoriesFirst.map(firstCat => {
        // 从 queryClient 缓存中获取该一级分类的二级数据
        // logger.debug("构建二级分类数据", firstCat.id)
        const cachedSecondaryData = queryClient.getQueryData(['resources', 'categories', selectedTypes.subjectId, firstCat.id]);

        return {
          label: firstCat.name,
          value: firstCat.id,
          // disabled: !cachedSecondaryData,
          children: cachedSecondaryData ? cachedSecondaryData.map(secondCat => ({
            label: secondCat.name,
            value: secondCat.id,
          })) : []
        };
      });
    } else {
      logger.debug("构建课程分类数据", categories);
      return categories.map(cat => ({
        label: cat.name,
        value: cat.id,
      }))
    }
  }, [type, categoriesFirst, categories, queryClient, categoriesSecondaryData, selectedTypes.subjectId]);

  /**
   * 字段变化处理函数
   */

  // 处理学科选择变化
  const handleSubjectChange = (subjectId) => {
    setSelectedTypes(prev => ({ ...prev, subjectId }));
    // 清空分类选择
    form.setFieldsValue({
      categoriyIds: null
    });
  };

  /**
   * 级联选择器处理
   */

  //处理二级分类加载慢的问题,点击选择后再加载
  const handleCascaderChange = (values) => {
    logger.debug("选中的值", values);
    const newValues = values.filter((item) => {
      if (item.length === 1) {
        const cachedSecondaryData = queryClient.getQueryData(['resources', 'categories', selectedTypes.subjectId, item[0]]);
        if (!cachedSecondaryData) {
          setSelectedTypes(pre => ({ ...pre, parentId: item[0] }));
          logger.debug("没有二级分类")
          return false;
        }
      }
      return true;
    })
    logger.debug("values", newValues)

    form.setFieldsValue({ categoryIds: newValues });
  }

  /**
   * 标签处理
   */
  // 处理标签输入
  const handleInputConfirm = () => {
    if (inputValue && !tags.includes(inputValue)) {
      setTagState({
        tags: [...tags, inputValue],
        inputValue: ''
      });
    }
  };
  //标签移除
  const handleTagRemove = (removedTag) => {
    setTagState({
      ...tagState,
      tags: tags.filter(tag => tag !== removedTag)
    });
  };

  /**
   * 表单事件处理
   */

  //类型切换
  const toggleType = value => {
    toggleModal(() => {
      setType(value);
      formReset();
    })
  }
  //提交
  const onFinish = (isSave = false) => {
    form.validateFields().then(() => {
      const values = form.getFieldsValue();
      logger.debug("初始数据", values);
      const submitData = {
        status: isSave ? 1 : 2,
        tags: tags,
        subjectId: values.subjectId,
        categoryIds: processCategoryIds(values.categoryIds),
        // 文件路径 - 直接从状态中获取
        files: getFile(values.file),
        coverImage: getFile(values.coverImage)[0],
        images: getFile(values.images),
        // 其他字段
        title: values.title,
        description: values.description,
        right: values.right,
        details: values.details,
      };
      // 处理价格
      if (values.right === 2) {
        submitData.price = values.price;
      }

      // 资源特有字段
      if (type === 1) {
        submitData.toolIds = values.toolIds || [];
      }

      // 课程特有字段
      if (type === 2) {
        submitData.subtitle = values.subtitle;
        submitData.level = values.level;
      }

      logger.debug('准备提交数据:', submitData);

      // 根据类型调用不同的提交接口
      if (type === 1) {
        doUploadResource(submitData);
      } else if (type === 2) {
        doUploadCourse(submitData);
      }
    }).catch((error) => {
      logger.error('表单验证失败:', error);
    });
  };
  //处理成功的表单清除
  useEffect(() => {
    if (resourceSuccess || courseSuccess) {
      formReset();
    }
  }, [resourceSuccess, courseSuccess])

  // 处理分类ID的函数
  const processCategoryIds = (cascaderValues) => {
    if (!cascaderValues || cascaderValues.length === 0) {
      return [];
    }

    if (type === 1) {
      // 资源类型：处理级联选择
      const secondaryIds = new Set();
      cascaderValues.forEach(valuePath => {
        if (valuePath.length === 2) {
          secondaryIds.add(valuePath[1]);
        } else if (valuePath.length === 1) {
          // 处理只选了一级分类的情况
          const secondaryIdsForFirstCat = getSecondaryIdsByFirstCategory(valuePath[0]);
          secondaryIdsForFirstCat.forEach(id => secondaryIds.add(id));
        }
      });
      return Array.from(secondaryIds);
    } else {
      // 课程类型：直接返回选择的值
      return cascaderValues.flat();
    }
  };

  const getSecondaryIdsByFirstCategory = (id) => {
    const cachedSecondaryData = categoryTreeData.find(i => i.value === id);
    return cachedSecondaryData.children.map((i) => i.value)
  }
  //重置
  const formReset = () => {
    form.resetFields();
    setFileList([]);
    setTagState({
      tags: [],
      inputValue: ''
    });
    setSelectedTypes({
      subjectId: null,
      parentId: null
    });
  };
  return (
    <section>
      <div className="bg-gradient-to-white h-72 uploadResource">
        <div className="max-w-5xl mx-auto px-2">
          <h3 className="text-3xl font-semibold pt-10 mb-3 flex items-center">上传信息</h3>
          <div className='flex justify-start gap-2 items-center'>
            <span className='text-lg'> <FolderOutlined /> 请选择上传的分类：</span>
            <OrderButton
              className="!text-lg"
              handleSortChange={(value) => toggleType(value)} value={type} list={[{ id: 1, name: "资源" }, { id: 2, name: "课程" }]} />
          </div>
        </div>
      </div >
      <div className="-mt-36 max-w-5xl mx-auto bg-card pt-6 py-2 px-8 mb-10 rounded-xl shadow-lg">
        <Form
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 20 }}
          form={form}
          initialValues={{
            price: 1,
            level: 2,
            details: "还没有任何详细介绍,支持Markdown语法编辑~",
            agreement: true
          }}
          layout="horizontal"
          onFinish={onFinish}
          className="space-y-8"
        >
          <Row gutter={16}>
            <Col span={24}>
              {/* 标题等设置 */}
              <>
                <Form.Item
                  name="title" label="标题" layout="horizontal"
                  rules={[{ required: true, message: '请输入标题（最多15字）' },
                  { max: 15, message: '标题不能超过15字' }
                  ]}>
                  <Input placeholder="请输入标题（最多15字）" className='max-w-120' />
                </Form.Item>
                <Form.Item
                  name="description"
                  label="描述"
                  layout="horizontal"
                  rules={[
                    { required: true, message: '请输入描述' },
                    { max: 50, message: '描述不能超过50字' }
                  ]}
                >
                  <TextArea
                    rows={3}
                    placeholder="简要描述内容特点和介绍（最多50字）"
                    showCount
                    maxLength={50}
                  />
                </Form.Item>
                {type === 2 && (
                  <Form.Item
                    name="subtitle"
                    label="副标题"
                    rules={[{ required: true, message: '请输入副标题（最多30字）' },
                    { max: 30, message: '副标题不能超过30字' }
                    ]}
                  >
                    <Input placeholder="请输入副标题（最多30字）" />
                  </Form.Item>
                )}
              </>
              {/* 分类设置 */}
              <>
                <Form.Item
                  name="right"
                  label="访问权限"
                  layout="horizontal"
                  rules={[{ required: true, message: '请选择访问权限' }]}
                >
                  <Select placeholder="选择访问权限" className='max-w-40'>
                    <Option value={1}>免费</Option>
                    <Option value={2}>积分兑换</Option>
                    <Option value={3}>VIP专享</Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  noStyle
                  shouldUpdate={(prev, current) => prev.right !== current.right}
                >
                  {({ getFieldValue }) =>
                    getFieldValue('right') === 2 && (
                      <Form.Item
                        name="price"
                        label="所需积分"
                        rules={[{ required: true, message: '请输入积分' }]}
                      >
                        <InputNumber
                          size='middle'
                          controls
                          min={1}
                          step={10}
                          max={100000}
                          placeholder="输入积分数量（1-100000）"
                          className="w-full overflow-hidden max-w-40"
                        />
                      </Form.Item>
                    )
                  }
                </Form.Item>

                {type === 1 && (
                  <>
                    <Form.Item
                      name="subjectId"
                      label="学科分类"
                      layout="horizontal"
                      rules={[{ required: true, message: '请选择学科分类' }]}
                    >
                      <Select placeholder="选择学科分类" className='max-w-40' onChange={handleSubjectChange}>
                        {resourceSubjects && resourceSubjects.map(subject => (
                          <Option key={subject.id} value={subject.id}>
                            {subject.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="toolIds"
                      label="工具分类"
                      rules={[{ required: true, message: '请选择工具分类' }]}
                    >
                      <Select
                        mode="multiple"
                        placeholder="选择工具"
                        className="w-auto"
                      >
                        {tools && tools.map(tool => (
                          <Option key={tool.id} value={tool.id}>
                            {tool.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      name="categoryIds"
                      label="资源分类"
                      rules={[{ required: true, message: '请选择资源分类' }]}
                    >
                      <Cascader
                        options={categoryTreeData}
                        placeholder="选择资源分类"
                        onChange={handleCascaderChange}
                        showSearch={{
                          filter: (inputValue, path) =>
                            path.some(option => option.label.toLowerCase().includes(inputValue.toLowerCase()))
                        }}
                        multiple
                        disabled={type === 1 && !selectedTypes.subjectId}
                        maxTagCount="responsive"
                      />
                    </Form.Item>
                  </>
                )}
                {type === 2 && (
                  <>
                    <Form.Item
                      name="subjectId"
                      label="学科分类"
                      layout="horizontal"
                      rules={[{ required: true, message: '请选择学科分类' }]}
                    >
                      <Select placeholder="选择学科分类" className='max-w-40'>
                        {courseSubjects && courseSubjects.map(subject => (
                          <Option key={subject.id} value={subject.id}>
                            {subject.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="level"
                      label="难度级别"
                      rules={[{ required: true, message: '请选择难度级别' }]}
                    >
                      <Radio.Group>
                        <Radio value={1}>初级</Radio>
                        <Radio value={2}>中级</Radio>
                        <Radio value={3}>高级</Radio>
                      </Radio.Group>
                    </Form.Item>
                    <Form.Item
                      name="categoryIds"
                      label="课程分类"
                      rules={[{ required: true, message: '请选择课程分类' }]}
                    >
                      <Select
                        mode="multiple"
                        placeholder="选择课程分类"
                      >
                        {categories && categories.map(cat => (
                          <Option key={cat.id} value={cat.id}>
                            {cat.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </>
                )}
                <Form.Item label="标签">
                  <div className="flex flex-wrap gap-2 mb-2 p-1 flex-col justify-start bg-main border border-main tag-container">
                    <div className='h-5 flex flex-wrap '>
                      {tags && tags.map(tag => (
                        <Tag
                          key={tag}
                          closable
                          onClose={() => handleTagRemove(tag)}
                          className="px-2 py-2"
                        >
                          {tag}
                        </Tag>
                      ))}
                    </div>
                    <Input
                      value={inputValue}
                      onChange={(e) => setTagState({
                        ...tagState,
                        inputValue: e.target.value
                      })}
                      onBlur={handleInputConfirm}
                      onPressEnter={handleInputConfirm}
                      placeholder='按下回车生成标签'
                    >
                    </Input>
                  </div>
                </Form.Item>
              </>

              {/* 文件上传 */}
              <>
                <Form.Item
                  label={type === 2 ? '课程文件' : '资源文件'}
                  name="file"
                  valuePropName="fileList"
                  rules={[
                    { required: true, message: '请上传文件' },
                    ({ getFieldValue }) => ({
                      validator(_, fileList) {
                        const hasUnfinishedFile = fileList && fileList.some(i => i.status !== 'done');
                        if (hasUnfinishedFile) {
                          return Promise.reject(new Error('请移除没有上传成功的文件'));
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                  getValueFromEvent={normFile}

                >
                  <UploadFiles fileList={fileList} setFileList={setFileList} type={type} />
                </Form.Item>
                <Form.Item
                  label="封面图片" name="coverImage"
                  className='cover'
                  valuePropName="fileList"
                  getValueFromEvent={normFile}
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, fileList) {
                        console.log(fileList)
                        const hasUnfinishedFile = fileList && fileList.some(i => i.status !== 'done');
                        if (hasUnfinishedFile) {
                          return Promise.reject(new Error('请移除没有上传成功的图片'));
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <UploadFiles type={3} />
                </Form.Item>
                {type === 1 && (
                  <Form.Item label="预览图片" name="images" valuePropName="fileList" getValueFromEvent={normFile}
                    rules={[
                      ({ getFieldValue }) => ({
                        validator(_, fileList) {
                          const hasUnfinishedFile = fileList && fileList.some(i => i.status !== 'done');
                          if (hasUnfinishedFile) {
                            return Promise.reject(new Error('请移除没有上传成功的图片'));
                          }
                          return Promise.resolve();
                        },
                      }),
                    ]}>
                    <UploadFiles type={4} />
                  </Form.Item>)}
              </>
              {/* 详情介绍 */}
              <Form.Item
                name="details"
                label={`${type === 1 ? '资源' : '课程'}详情`}
                rules={[
                  { max: 5000, message: '描述不能超过5000字' }
                ]}
              >
                <MDEditor
                  enableScroll={false}
                  preview="edit"
                  style={{ minHeight: 300 }}
                  data-color-mode="light"
                />
              </Form.Item>

              <div className='mx-auto w-[95%] my-10 '>
                <Divider className="bg-gray" />
              </div>
              {/* 底部操作 */}
              <div className='mx-32' >
                <div className="bg-orange-light p-4 rounded my-4 text-center flex flex-col justify-center items-center">
                  <h4 className="font-medium mb-2">上传须知</h4>
                  <ul className="text-sm text-secondary space-y-1 list-disc list-inside text-left">
                    <li>请确保内容符合法律法规及平台规范，禁止传播违法违规信息，避免内容下架、账号受限。</li>
                    <li>请勿上传侵犯他人著作权、肖像权等合法权益的内容，侵权需承担法律责任，平台将下架相关内容。</li>
                    <li>审核通常需1-3个工作日，节假日或高峰期可能延长1-2天，建议合理安排提交时间。</li>
                    <li>内容通过审核后将在平台展示（位置依内容质量匹配），可查看数据，违规或数据差可能调整展示范围。</li>
                  </ul>
                </div>
                <Form.Item
                  name="agreement"
                  valuePropName="checked"
                  rules={[
                    {
                      validator: (_, value) =>
                        value ? Promise.resolve() : Promise.reject(new Error('请同意《资源上传协议》和《版权声明》！')),
                    },
                  ]}>
                  <Checkbox>
                    <span className='text-main'>我已阅读并同意</span>
                    <Link to='' className='text-green'> 《资源课程上传协议》</Link>
                    <span className='text-main'>和</span>
                    <Link to='' className='text-green'> 《版权声明》 </Link>
                  </Checkbox>
                </Form.Item>
                {/* 表单按钮 */}

                <div className='flex justify-between mb-10'>
                  <div className='flex gap-4'>
                    <SubmitConfirmButton onConfirm={onFinish}
                    >
                      提交
                    </SubmitConfirmButton>
                    <MyButton type='gray' htmltype="submit" onClick={() => onFinish(true)}
                    >
                      保存草稿
                    </MyButton>
                  </div>

                  <ResetConfirmButton onConfirm={formReset}
                  >
                    重置
                  </ResetConfirmButton>
                  {/* <CancelConfirmButton
                    >
                      取消
                    </CancelConfirmButton> */}
                </div>

              </div>
            </Col>
          </Row>
        </Form>
      </div >
    </section>

  );
};

export default UploadResource;