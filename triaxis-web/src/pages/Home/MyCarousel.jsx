import { Divider } from 'antd';
import { useNavigate } from 'react-router-dom';
import MyButton from '../../components/MyButton';
import { Carousel, Space, Typography } from '@douyinfe/semi-ui';

function MyCarousel({ imgList, textList = null, path, description }) {
  const navigate = useNavigate();
  const { Title, Paragraph } = Typography;
  const style = {
    width: '100%',
    height: '40rem',
  };

  const titleStyle = {
    position: 'absolute',
    top: '100px',
    left: '100px'
  };

  const colorStyle = {
    color: '#1a1b1cff'
  };
  const Introduce = () => {
    return <div className="w-full w-2/5 md:w-2/5 h-[500px] flex flex-col justify-center items-center p-8 md:p-12 bg-gray-50">
      <h3 className="text-2xl font-semibold text-secodary ">{description.title}</h3>
      <Divider className="bg-gray" />
      <p className="text-secondary mb-15 mt-1  leading-relaxed text-center">{description.introduce}</p>
      <MyButton
        size="large"
        type={description.isImageLeft ? 'blue' : 'green'}
        onClick={() => navigate(path)}
      >
        立即搜索
      </MyButton>
    </div>
  }
  const Images = () => {
    return <div className="rounded-lg w-full w-3/5 md:w-3/5 h-[500px] relative overflow-hidden">
      <Carousel style={style} indicatorType='dot' indicatorPosition={'center'} indicatorSize={'small'} theme='dark' autoPlay={{ interval: 1500, hoverToPause: true }}>
        {
          imgList.map((src, index) => {
            return (
              <div key={index} style={{ backgroundSize: 'cover', backgroundImage: `url('${src}')` }}>
                {textList &&
                  <Space vertical align='start' spacing='medium' style={titleStyle}>
                    <Title heading={2} style={colorStyle}>{textList[index][0]}</Title>
                    <Space vertical align='start'>
                      <Paragraph style={colorStyle}>{textList[index][1]}</Paragraph>
                      <Paragraph style={colorStyle}>{textList[index][2]}</Paragraph>
                    </Space>
                  </Space>}
              </div>
            );
          })
        }
      </Carousel>
    </div>
  }


  return (
    <div className="flex flex-col md:flex-row gap-8 justify-center">
      {description.isImageLeft ? (
        <>
          <Images />
          <Introduce />
        </>

      ) : (
        <>
          <Introduce />
          <Images />
        </>
      )
      }
    </div>
  );
};

export default MyCarousel;