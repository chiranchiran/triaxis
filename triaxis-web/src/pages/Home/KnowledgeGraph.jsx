import React, { useCallback, useMemo, useState, useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';

// 模拟后端API调用 - 扩展版
const mockFetchKnowledgeGraphData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.05) {
        reject(new Error('网络请求失败，请稍后重试'));
        return;
      }

      const response = {
        success: true,
        data: {
          nodes: [
            // === 核心学科基础 ===
            {
              id: 'core',
              type: 'core',
              label: '城乡规划学',
              description: '研究城乡空间布局、发展规律与规划管理的综合性应用学科',
              level: 0
            },

            // === 理论基础体系 ===
            {
              id: 'theory-planning',
              type: 'theory',
              label: '城市规划理论',
              description: '城市发展规律、空间结构与功能组织的理论体系',
              level: 1
            },
            {
              id: 'theory-rural',
              type: 'theory',
              label: '乡村规划理论',
              description: '乡村聚落发展、乡土文化与振兴策略的理论基础',
              level: 1
            },
            {
              id: 'theory-regional',
              type: 'theory',
              label: '区域规划理论',
              description: '区域协调发展、空间结构与城镇体系的理论指导',
              level: 1
            },
            {
              id: 'theory-sustainable',
              type: 'theory',
              label: '可持续发展理论',
              description: '经济、社会、环境协调发展的规划指导原则',
              level: 1
            },
            {
              id: 'theory-space',
              type: 'theory',
              label: '空间规划体系',
              description: '国土空间开发保护格局的系统性理论框架',
              level: 1
            },
            {
              id: 'theory-ecology',
              type: 'theory',
              label: '生态城市规划理论',
              description: '生态优先、绿色发展的城市发展理论',
              level: 1
            },
            {
              id: 'theory-human',
              type: 'theory',
              label: '人居环境科学',
              description: '人类聚居环境形成与发展的综合性学科',
              level: 1
            },

            // === 技术方法体系 ===
            {
              id: 'tech-gis',
              type: 'technology',
              label: 'GIS空间分析',
              description: '地理信息系统在空间数据处理与分析中的应用',
              level: 2
            },
            {
              id: 'tech-rs',
              type: 'technology',
              label: '遥感监测技术',
              description: '遥感影像获取与地表信息提取分析技术',
              level: 2
            },
            {
              id: 'tech-bigdata',
              type: 'technology',
              label: '规划大数据分析',
              description: '多源数据融合的城市运行状态分析',
              level: 2
            },
            {
              id: 'tech-3d',
              type: 'technology',
              label: '三维建模与仿真',
              description: '城市空间三维可视化与方案模拟技术',
              level: 2
            },
            {
              id: 'tech-spatial',
              type: 'technology',
              label: '空间句法分析',
              description: '空间构形与人类活动关系的量化分析方法',
              level: 2
            },
            {
              id: 'tech-network',
              type: 'technology',
              label: '空间网络分析',
              description: '交通网络、基础设施网络的拓扑分析',
              level: 2
            },
            {
              id: 'tech-scenario',
              type: 'technology',
              label: '情景规划分析',
              description: '多情景模拟与规划方案比选方法',
              level: 2
            },
            {
              id: 'tech-participation',
              type: 'technology',
              label: '公众参与技术',
              description: '社区参与式规划的技术方法与工具',
              level: 2
            },
            {
              id: 'tech-assessment',
              type: 'technology',
              label: '规划评估技术',
              description: '规划实施效果评估与监测方法',
              level: 2
            },

            // === 规划实践应用 ===
            {
              id: 'app-territorial',
              type: 'application',
              label: '国土空间规划',
              description: '国家空间发展的战略性、基础性、约束性规划',
              level: 3
            },
            {
              id: 'app-urban-design',
              type: 'application',
              label: '城市设计',
              description: '城市空间形态与景观环境的整体构思',
              level: 3
            },
            {
              id: 'app-landuse',
              type: 'application',
              label: '土地利用规划',
              description: '土地资源合理配置与用途管制',
              level: 3
            },
            {
              id: 'app-transport',
              type: 'application',
              label: '交通系统规划',
              description: '综合交通体系与运输网络布局',
              level: 3
            },
            {
              id: 'app-infrastructure',
              type: 'application',
              label: '基础设施规划',
              description: '市政工程与公共服务设施布局',
              level: 3
            },
            {
              id: 'app-ecological',
              type: 'application',
              label: '生态保护规划',
              description: '生态系统保护与修复的空间安排',
              level: 3
            },
            {
              id: 'app-historic',
              type: 'application',
              label: '历史文化保护',
              description: '历史文化遗产保护与活化利用',
              level: 3
            },
            {
              id: 'app-renewal',
              type: 'application',
              label: '城市更新规划',
              description: '建成区功能提升与环境改善',
              level: 3
            },
            {
              id: 'app-rural-revitalization',
              type: 'application',
              label: '乡村振兴规划',
              description: '乡村产业、人才、文化、生态、组织振兴',
              level: 3
            },
            {
              id: 'app-emergency',
              type: 'application',
              label: '应急避难规划',
              description: '防灾减灾与应急空间体系规划',
              level: 3
            },

            // === 数据支撑体系 ===
            {
              id: 'data-multi-source',
              type: 'data',
              label: '多源数据融合',
              description: '遥感、POI、手机信令等多源数据整合',
              level: 4
            },
            {
              id: 'data-spatial-db',
              type: 'data',
              label: '空间数据库',
              description: '地理空间数据的存储与管理',
              level: 4
            },
            {
              id: 'data-crowdsourcing',
              type: 'data',
              label: '众源数据采集',
              description: '公众参与式数据收集与更新',
              level: 4
            },
            {
              id: 'data-real-time',
              type: 'data',
              label: '实时监测数据',
              description: '城市运行状态的实时感知数据',
              level: 4
            },

            // === 相关交叉学科 ===
            {
              id: 'related-geography',
              type: 'related',
              label: '城市地理学',
              description: '城市形成发展、空间组织与环境关系研究',
              level: 5
            },
            {
              id: 'related-architecture',
              type: 'related',
              label: '建筑学',
              description: '建筑设计与建成环境营造',
              level: 5
            },
            {
              id: 'related-environmental',
              type: 'related',
              label: '环境工程',
              description: '环境污染防治与环境质量改善',
              level: 5
            },
            {
              id: 'related-economics',
              type: 'related',
              label: '城市经济学',
              description: '城市经济发展与空间经济分析',
              level: 5
            },
            {
              id: 'related-sociology',
              type: 'related',
              label: '城市社会学',
              description: '城市社会结构与社会空间研究',
              level: 5
            },
            {
              id: 'related-transport',
              type: 'related',
              label: '交通工程',
              description: '交通系统规划设计与运营管理',
              level: 5
            },
            {
              id: 'related-landscape',
              type: 'related',
              label: '风景园林',
              description: '园林绿地系统与景观环境设计',
              level: 5
            },
            {
              id: 'related-computer',
              type: 'related',
              label: '计算机科学',
              description: '空间计算与智慧城市技术支撑',
              level: 5
            },
            {
              id: 'related-management',
              type: 'related',
              label: '公共管理',
              description: '规划实施与政策管理支撑',
              level: 5
            },

            // === 政策法规体系 ===
            {
              id: 'policy-laws',
              type: 'policy',
              label: '城乡规划法',
              description: '城乡规划编制实施的法律依据',
              level: 6
            },
            {
              id: 'policy-standards',
              type: 'policy',
              label: '技术标准规范',
              description: '规划编制与管理的技术标准',
              level: 6
            },
            {
              id: 'policy-implementation',
              type: 'policy',
              label: '实施管理机制',
              description: '规划实施监督与管理机制',
              level: 6
            }
          ],
          edges: [
            // 核心学科关联
            { id: 'e-core-theory-planning', source: 'core', target: 'theory-planning', label: '核心理论', strength: 0.95 },
            { id: 'e-core-theory-rural', source: 'core', target: 'theory-rural', label: '核心理论', strength: 0.9 },
            { id: 'e-core-theory-regional', source: 'core', target: 'theory-regional', label: '核心理论', strength: 0.9 },
            { id: 'e-core-theory-sustainable', source: 'core', target: 'theory-sustainable', label: '指导原则', strength: 0.85 },
            { id: 'e-core-theory-space', source: 'core', target: 'theory-space', label: '体系框架', strength: 0.9 },
            { id: 'e-core-theory-ecology', source: 'core', target: 'theory-ecology', label: '发展理念', strength: 0.8 },
            { id: 'e-core-theory-human', source: 'core', target: 'theory-human', label: '理论基础', strength: 0.85 },

            // 理论与技术关联
            { id: 'e-theory-planning-tech-gis', source: 'theory-planning', target: 'tech-gis', label: '技术支撑', strength: 0.8 },
            { id: 'e-theory-planning-tech-3d', source: 'theory-planning', target: 'tech-3d', label: '技术支撑', strength: 0.7 },
            { id: 'e-theory-rural-tech-rs', source: 'theory-rural', target: 'tech-rs', label: '监测手段', strength: 0.75 },
            { id: 'e-theory-regional-tech-network', source: 'theory-regional', target: 'tech-network', label: '分析方法', strength: 0.8 },
            { id: 'e-theory-sustainable-tech-assessment', source: 'theory-sustainable', target: 'tech-assessment', label: '评估工具', strength: 0.7 },
            { id: 'e-theory-space-tech-spatial', source: 'theory-space', target: 'tech-spatial', label: '分析技术', strength: 0.8 },
            { id: 'e-theory-ecology-tech-scenario', source: 'theory-ecology', target: 'tech-scenario', label: '模拟工具', strength: 0.7 },
            { id: 'e-theory-human-tech-participation', source: 'theory-human', target: 'tech-participation', label: '参与方法', strength: 0.75 },
            { id: 'e-theory-sustainable-tech-bigdata', source: 'theory-sustainable', target: 'tech-bigdata', label: '数据支撑', strength: 0.8 },

            // 技术与应用关联
            { id: 'e-tech-gis-app-territorial', source: 'tech-gis', target: 'app-territorial', label: '空间分析', strength: 0.9 },
            { id: 'e-tech-rs-app-landuse', source: 'tech-rs', target: 'app-landuse', label: '监测识别', strength: 0.85 },
            { id: 'e-tech-bigdata-app-transport', source: 'tech-bigdata', target: 'app-transport', label: '流量分析', strength: 0.8 },
            { id: 'e-tech-3d-app-urban-design', source: 'tech-3d', target: 'app-urban-design', label: '可视化', strength: 0.9 },
            { id: 'e-tech-spatial-app-renewal', source: 'tech-spatial', target: 'app-renewal', label: '空间优化', strength: 0.75 },
            { id: 'e-tech-network-app-infrastructure', source: 'tech-network', target: 'app-infrastructure', label: '网络规划', strength: 0.8 },
            { id: 'e-tech-scenario-app-ecological', source: 'tech-scenario', target: 'app-ecological', label: '情景模拟', strength: 0.7 },
            { id: 'e-tech-participation-app-rural-revitalization', source: 'tech-participation', target: 'app-rural-revitalization', label: '社区参与', strength: 0.8 },
            { id: 'e-tech-assessment-app-emergency', source: 'tech-assessment', target: 'app-emergency', label: '风险评估', strength: 0.7 },
            { id: 'e-tech-bigdata-app-renewal', source: 'tech-bigdata', target: 'app-renewal', label: '现状分析', strength: 0.75 },

            // 应用之间的关联
            { id: 'e-app-territorial-app-landuse', source: 'app-territorial', target: 'app-landuse', label: '包含', strength: 0.9 },
            { id: 'e-app-territorial-app-ecological', source: 'app-territorial', target: 'app-ecological', label: '协调', strength: 0.85 },
            { id: 'e-app-urban-design-app-renewal', source: 'app-urban-design', target: 'app-renewal', label: '指导', strength: 0.8 },
            { id: 'e-app-transport-app-infrastructure', source: 'app-transport', target: 'app-infrastructure', label: '协同', strength: 0.8 },
            { id: 'e-app-landuse-app-rural-revitalization', source: 'app-landuse', target: 'app-rural-revitalization', label: '支撑', strength: 0.7 },

            // 数据支撑关联
            { id: 'e-data-multi-source-tech-bigdata', source: 'data-multi-source', target: 'tech-bigdata', label: '数据基础', strength: 0.9 },
            { id: 'e-data-spatial-db-tech-gis', source: 'data-spatial-db', target: 'tech-gis', label: '数据管理', strength: 0.85 },
            { id: 'e-data-crowdsourcing-tech-participation', source: 'data-crowdsourcing', target: 'tech-participation', label: '数据来源', strength: 0.8 },
            { id: 'e-data-real-time-tech-assessment', source: 'data-real-time', target: 'tech-assessment', label: '监测数据', strength: 0.75 },

            // 交叉学科关联
            { id: 'e-core-related-geography', source: 'core', target: 'related-geography', label: '理论基础', strength: 0.9 },
            { id: 'e-core-related-architecture', source: 'core', target: 'related-architecture', label: '空间设计', strength: 0.85 },
            { id: 'e-core-related-environmental', source: 'core', target: 'related-environmental', label: '环境支撑', strength: 0.8 },
            { id: 'e-core-related-economics', source: 'core', target: 'related-economics', label: '经济分析', strength: 0.8 },
            { id: 'e-core-related-sociology', source: 'core', target: 'related-sociology', label: '社会研究', strength: 0.75 },
            { id: 'e-core-related-transport', source: 'core', target: 'related-transport', label: '技术支撑', strength: 0.8 },
            { id: 'e-core-related-landscape', source: 'core', target: 'related-landscape', label: '环境设计', strength: 0.7 },
            { id: 'e-core-related-computer', source: 'core', target: 'related-computer', label: '技术方法', strength: 0.8 },
            { id: 'e-core-related-management', source: 'core', target: 'related-management', label: '实施保障', strength: 0.75 },

            // 政策法规关联
            { id: 'e-policy-laws-app-territorial', source: 'policy-laws', target: 'app-territorial', label: '法律依据', strength: 0.9 },
            { id: 'e-policy-standards-tech-gis', source: 'policy-standards', target: 'tech-gis', label: '规范标准', strength: 0.7 },
            { id: 'e-policy-implementation-app-renewal', source: 'policy-implementation', target: 'app-renewal', label: '实施保障', strength: 0.8 },
            { id: 'e-policy-laws-app-landuse', source: 'policy-laws', target: 'app-landuse', label: '法律约束', strength: 0.85 }
          ]
        },
        timestamp: new Date().toISOString(),
        statistics: {
          totalNodes: 38,
          totalEdges: 54,
          lastUpdated: new Date().toISOString()
        }
      };

      resolve(response);
    }, 1200);
  });
};

const UrbanPlanningKnowledgeGraph = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [graphData, setGraphData] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [nodeStats, setNodeStats] = useState({ visible: 0, total: 0 });

  // 从后端获取数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await mockFetchKnowledgeGraphData();
        setGraphData(response.data);
        setNodeStats({
          visible: response.data.nodes.length,
          total: response.data.nodes.length
        });
      } catch (err) {
        setError(err.message);
        console.error('获取知识图谱数据失败:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 转换节点数据为React Flow格式
  const reactFlowNodes = useMemo(() => {
    if (!graphData) return [];

    // 根据节点类型和层级计算位置
    const getNodePosition = (node, index, totalInLevel) => {
      const levelPositions = {
        0: { x: 100, y: 400 },   // 核心节点
        1: { x: 400, y: 100 },   // 理论节点
        2: { x: 700, y: 150 },   // 技术节点
        3: { x: 1000, y: 200 },   // 应用节点
        4: { x: 1300, y: 250 },   // 数据节点
        5: { x: 1600, y: 300 },  // 相关学科
        6: { x: 1900, y: 350 }   // 政策法规
      };

      const basePosition = levelPositions[node.level] || { x: 0, y: 0 };
      const spacing = 800 / (totalInLevel + 1);

      return {
        x: basePosition.x,
        y: basePosition.y + (index * spacing)
      };
    };

    // 按层级分组计算位置
    const nodesByLevel = {};
    graphData.nodes.forEach(node => {
      if (!nodesByLevel[node.level]) nodesByLevel[node.level] = [];
      nodesByLevel[node.level].push(node);
    });

    return graphData.nodes.map(node => {
      const levelNodes = nodesByLevel[node.level] || [];
      const nodeIndex = levelNodes.findIndex(n => n.id === node.id);
      const position = getNodePosition(node, nodeIndex, levelNodes.length);

      // 根据节点类型设置样式
      const getNodeStyle = (type) => {
        const baseStyle = {
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          textAlign: 'center',
          minWidth: '160px',
          padding: '8px 12px'
        };

        const typeStyles = {
          core: {
            backgroundColor: '#bbdefb',
            border: '3px solid #1e88e5',
            color: '#0d47a1',
            fontSize: '16px',
            fontWeight: 'bold'
          },
          theory: {
            backgroundColor: '#f5f7fa',
            border: '2px solid #607d8b',
            color: '#37474f'
          },
          technology: {
            backgroundColor: '#e3f2fd',
            border: '2px solid #71b5edff',
            color: '#285eaeff'
          },
          application: {
            backgroundColor: '#e8f5e9',
            border: '2px solid #7fad80ff',
            color: '#1b5e20'
          },
          data: {
            backgroundColor: '#f3e5f5',
            border: '2px solid #9f6fa7ff',
            color: '#a498b1ff'
          },
          related: {
            backgroundColor: '#fff3e0',
            border: '2px solid #efc07bff',
            color: '#e6ae8fff'
          },
          policy: {
            backgroundColor: '#ffebee',
            border: '2px solid #eda5a0ff',
            color: '#dca8a8ff'
          }
        };

        return { ...baseStyle, ...typeStyles[type] };
      };

      const style = getNodeStyle(node.type);

      return {
        id: node.id,
        type: 'default',
        position,
        data: {
          label: (
            <div
              className="px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105"
              style={style}
            >
              <div className="font-semibold leading-tight">{node.label}</div>
            </div>
          ),
          originalData: node
        },
        style: {
          ...style,
          width: 'auto'
        }
      };
    });
  }, [graphData]);

  // 转换边数据为React Flow格式
  const reactFlowEdges = useMemo(() => {
    if (!graphData) return [];

    return graphData.edges.map(edge => {
      const strokeWidth = 1 + (edge.strength * 2);
      const opacity = 0.4 + (edge.strength * 0.6);

      return {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        label: edge.label,
        style: {
          stroke: '#78909c',
          strokeWidth,
          opacity
        },
        labelStyle: {
          fill: '#546e7a',
          fontSize: '10px',
          fontWeight: '500'
        },
        labelBgStyle: {
          fill: 'rgba(255, 255, 255, 0.9)',
          stroke: 'rgba(255, 255, 255, 0.9)'
        }
      };
    });
  }, [graphData]);

  const [nodes, setNodes, onNodesChange] = useNodesState(reactFlowNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(reactFlowEdges);

  // 当graphData变化时更新节点和边
  useEffect(() => {
    setNodes(reactFlowNodes);
    setEdges(reactFlowEdges);
  }, [reactFlowNodes, reactFlowEdges, setNodes, setEdges]);

  // 节点点击事件
  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node.data.originalData);
  }, []);

  // 画布点击事件（点击空白处取消选择）
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // 重新加载数据
  const handleRetry = useCallback(() => {
    window.location.reload();
  }, []);

  // 加载状态
  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">正在加载城乡规划知识图谱数据...</p>
          <p className="text-gray-500 text-sm mt-2">获取完整的学科体系与关联关系</p>
        </div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center bg-red-50 p-8 rounded-lg border border-red-200 max-w-md">
          <div className="text-red-500 text-xl font-semibold mb-2">数据加载失败</div>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="px-6 py-2 bg-dark text-white rounded-lg transition-colors"
          >
            重新加载数据
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex">
      {/* 知识图谱主体 */}
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          fitView
          minZoom={0.1}
          maxZoom={2}
          defaultViewport={{ x: 0, y: 0, zoom: 0.6 }}
        >
          <Controls
            className="bg-white/90 backdrop-blur-sm border border-gray-300 rounded-lg shadow-lg"
            position="top-right"
          />
          <MiniMap
            nodeColor={(node) => {
              const type = node.data.originalData?.type;
              const colors = {
                core: '#bbdefb',
                theory: '#f5f7fa',
                technology: '#e3f2fd',
                application: '#e8f5e9',
                data: '#f3e5f5',
                related: '#fff3e0',
                policy: '#ffebee'
              };
              return colors[type] || '#eeeeee';
            }}
            nodeStrokeColor={(node) => {
              const type = node.data.originalData?.type;
              const colors = {
                core: '#1e88e5',
                theory: '#607d8b',
                technology: '#2196f3',
                application: '#4caf50',
                data: '#9c27b0',
                related: '#ff9800',
                policy: '#f44336'
              };
              return colors[type] || '#9e9e9e';
            }}
            position="bottom-right"
            className="bg-white/90 backdrop-blur-sm border border-gray-300 rounded-lg shadow-lg"
            zoomable
            pannable
          />
          <Background color="#94a3b8" gap={25} />
          <Panel position="top-left" className="bg-white/95 backdrop-blur-sm p-4 rounded-lg border border-gray-300 shadow-lg">
            <div className="text-sm font-bold text-gray-800 mb-1">
              城乡规划学科知识图谱
            </div>
            <div className="text-xs text-gray-600 space-y-1">
              <div>节点: {nodeStats.visible}/{nodeStats.total}</div>
              <div>关系: {graphData?.edges.length || 0} 条</div>
              <div>更新: {new Date().toLocaleTimeString()}</div>
            </div>
          </Panel>
        </ReactFlow>
      </div>

      {/* 节点详情面板 */}
      {selectedNode && (
        <div className="w-96 bg-white/95 backdrop-blur-sm border-l border-gray-300 p-6 overflow-y-auto shadow-lg">
          <div className="mb-6">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mb-3"
              style={{
                backgroundColor:
                  selectedNode.type === 'core' ? '#1e88e5' :
                    selectedNode.type === 'theory' ? '#607d8b' :
                      selectedNode.type === 'technology' ? '#2196f3' :
                        selectedNode.type === 'application' ? '#4caf50' :
                          selectedNode.type === 'data' ? '#9c27b0' :
                            selectedNode.type === 'related' ? '#ff9800' : '#f44336'
              }}
            >
              {selectedNode.type.charAt(0).toUpperCase()}
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{selectedNode.label}</h3>
            <p className="text-gray-600 leading-relaxed">{selectedNode.description}</p>
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-sm font-semibold text-gray-700 mb-2">节点属性</div>
              <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">节点类型:</span>
                  <span className="text-gray-800 font-medium capitalize">{selectedNode.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">知识层级:</span>
                  <span className="text-gray-800 font-medium">L{selectedNode.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">节点ID:</span>
                  <span className="text-gray-800 font-mono text-xs">{selectedNode.id}</span>
                </div>
              </div>
            </div>

            <div>
              <div className="text-sm font-semibold text-gray-700 mb-2">关联统计</div>
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-xs text-blue-700">
                  该节点连接了 {
                    graphData?.edges.filter(edge =>
                      edge.source === selectedNode.id || edge.target === selectedNode.id
                    ).length || 0
                  } 个其他节点
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setSelectedNode(null)}
            className="mt-6 w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            关闭详情
          </button>
        </div>
      )}
    </div>
  );
};

export default UrbanPlanningKnowledgeGraph;