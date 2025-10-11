import React, { useCallback, useMemo, useState } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';

const UrbanPlanningKnowledgeGraph = () => {
  // 城乡规划学科知识图谱数据
  const initialNodes = useMemo(() => [
    // 核心理论层
    {
      id: 'core',
      type: 'default',
      position: { x: 100, y: 300 },
      data: {
        label: (
          <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg shadow-sm">
            <div className="font-bold text-blue-800 text-center">城乡规划学</div>
            <div className="text-xs text-blue-600 mt-1 text-center">核心学科</div>
          </div>
        )
      },
      style: {
        backgroundColor: '#e3f2fd',
        border: '2px solid #64b5f6',
        borderRadius: '8px',
      },
    },
    // 理论基础
    {
      id: 'theory-1',
      type: 'default',
      position: { x: 350, y: 100 },
      data: {
        label: (
          <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg">
            <div className="font-semibold text-gray-800">城市规划理论</div>
          </div>
        )
      },
      style: {
        backgroundColor: '#f8f9fa',
        border: '1px solid #bdbdbd',
        borderRadius: '6px',
      },
    },
    {
      id: 'theory-2',
      type: 'default',
      position: { x: 350, y: 180 },
      data: {
        label: (
          <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg">
            <div className="font-semibold text-gray-800">乡村规划理论</div>
          </div>
        )
      },
      style: {
        backgroundColor: '#f8f9fa',
        border: '1px solid #bdbdbd',
        borderRadius: '6px',
      },
    },
    {
      id: 'theory-3',
      type: 'default',
      position: { x: 350, y: 260 },
      data: {
        label: (
          <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg">
            <div className="font-semibold text-gray-800">空间规划体系</div>
          </div>
        )
      },
      style: {
        backgroundColor: '#f8f9fa',
        border: '1px solid #bdbdbd',
        borderRadius: '6px',
      },
    },
    {
      id: 'theory-4',
      type: 'default',
      position: { x: 350, y: 340 },
      data: {
        label: (
          <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg">
            <div className="font-semibold text-gray-800">可持续发展理论</div>
          </div>
        )
      },
      style: {
        backgroundColor: '#f8f9fa',
        border: '1px solid #bdbdbd',
        borderRadius: '6px',
      },
    },
    {
      id: 'theory-5',
      type: 'default',
      position: { x: 350, y: 420 },
      data: {
        label: (
          <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg">
            <div className="font-semibold text-gray-800">人居环境科学</div>
          </div>
        )
      },
      style: {
        backgroundColor: '#f8f9fa',
        border: '1px solid #bdbdbd',
        borderRadius: '6px',
      },
    },
    // 技术方法层
    {
      id: 'tech-1',
      type: 'default',
      position: { x: 600, y: 80 },
      data: {
        label: (
          <div className="px-3 py-2 bg-blue-100 border border-blue-300 rounded-lg">
            <div className="font-semibold text-blue-800">GIS技术应用</div>
          </div>
        )
      },
      style: {
        backgroundColor: '#e3f2fd',
        border: '1px solid #64b5f6',
        borderRadius: '6px',
      },
    },
    {
      id: 'tech-2',
      type: 'default',
      position: { x: 600, y: 160 },
      data: {
        label: (
          <div className="px-3 py-2 bg-blue-100 border border-blue-300 rounded-lg">
            <div className="font-semibold text-blue-800">空间分析方法</div>
          </div>
        )
      },
      style: {
        backgroundColor: '#e3f2fd',
        border: '1px solid #64b5f6',
        borderRadius: '6px',
      },
    },
    {
      id: 'tech-3',
      type: 'default',
      position: { x: 600, y: 240 },
      data: {
        label: (
          <div className="px-3 py-2 bg-blue-100 border border-blue-300 rounded-lg">
            <div className="font-semibold text-blue-800">大数据分析</div>
          </div>
        )
      },
      style: {
        backgroundColor: '#e3f2fd',
        border: '1px solid #64b5f6',
        borderRadius: '6px',
      },
    },
    {
      id: 'tech-4',
      type: 'default',
      position: { x: 600, y: 320 },
      data: {
        label: (
          <div className="px-3 py-2 bg-blue-100 border border-blue-300 rounded-lg">
            <div className="font-semibold text-blue-800">遥感监测技术</div>
          </div>
        )
      },
      style: {
        backgroundColor: '#e3f2fd',
        border: '1px solid #64b5f6',
        borderRadius: '6px',
      },
    },
    {
      id: 'tech-5',
      type: 'default',
      position: { x: 600, y: 400 },
      data: {
        label: (
          <div className="px-3 py-2 bg-blue-100 border border-blue-300 rounded-lg">
            <div className="font-semibold text-blue-800">三维建模</div>
          </div>
        )
      },
      style: {
        backgroundColor: '#e3f2fd',
        border: '1px solid #64b5f6',
        borderRadius: '6px',
      },
    },
    // 实践应用层
    {
      id: 'app-1',
      type: 'default',
      position: { x: 850, y: 60 },
      data: {
        label: (
          <div className="px-3 py-2 bg-gray-100 border border-gray-400 rounded-lg">
            <div className="font-semibold text-gray-800">国土空间规划</div>
          </div>
        )
      },
      style: {
        backgroundColor: '#f5f5f5',
        border: '1px solid #757575',
        borderRadius: '6px',
      },
    },
    {
      id: 'app-2',
      type: 'default',
      position: { x: 850, y: 140 },
      data: {
        label: (
          <div className="px-3 py-2 bg-gray-100 border border-gray-400 rounded-lg">
            <div className="font-semibold text-gray-800">城市设计</div>
          </div>
        )
      },
      style: {
        backgroundColor: '#f5f5f5',
        border: '1px solid #757575',
        borderRadius: '6px',
      },
    },
    {
      id: 'app-3',
      type: 'default',
      position: { x: 850, y: 220 },
      data: {
        label: (
          <div className="px-3 py-2 bg-gray-100 border border-gray-400 rounded-lg">
            <div className="font-semibold text-gray-800">土地利用规划</div>
          </div>
        )
      },
      style: {
        backgroundColor: '#f5f5f5',
        border: '1px solid #757575',
        borderRadius: '6px',
      },
    },
    {
      id: 'app-4',
      type: 'default',
      position: { x: 850, y: 300 },
      data: {
        label: (
          <div className="px-3 py-2 bg-gray-100 border border-gray-400 rounded-lg">
            <div className="font-semibold text-gray-800">交通规划</div>
          </div>
        )
      },
      style: {
        backgroundColor: '#f5f5f5',
        border: '1px solid #757575',
        borderRadius: '6px',
      },
    },
    {
      id: 'app-5',
      type: 'default',
      position: { x: 850, y: 380 },
      data: {
        label: (
          <div className="px-3 py-2 bg-gray-100 border border-gray-400 rounded-lg">
            <div className="font-semibold text-gray-800">基础设施规划</div>
          </div>
        )
      },
      style: {
        backgroundColor: '#f5f5f5',
        border: '1px solid #757575',
        borderRadius: '6px',
      },
    },
    {
      id: 'app-6',
      type: 'default',
      position: { x: 850, y: 460 },
      data: {
        label: (
          <div className="px-3 py-2 bg-gray-100 border border-gray-400 rounded-lg">
            <div className="font-semibold text-gray-800">生态保护规划</div>
          </div>
        )
      },
      style: {
        backgroundColor: '#f5f5f5',
        border: '1px solid #757575',
        borderRadius: '6px',
      },
    }
  ], []);

  // 知识图谱关系边
  const initialEdges = useMemo(() => [
    // 核心理论与技术方法的关系
    { id: 'e-core-theory1', source: 'core', target: 'theory-1', label: '理论基础', style: { stroke: '#64b5f6' } },
    { id: 'e-core-theory2', source: 'core', target: 'theory-2', label: '理论基础', style: { stroke: '#64b5f6' } },
    { id: 'e-core-theory3', source: 'core', target: 'theory-3', label: '理论基础', style: { stroke: '#64b5f6' } },
    { id: 'e-core-theory4', source: 'core', target: 'theory-4', label: '理论基础', style: { stroke: '#64b5f6' } },
    { id: 'e-core-theory5', source: 'core', target: 'theory-5', label: '理论基础', style: { stroke: '#64b5f6' } },

    // 理论与技术的关系
    { id: 'e-theory1-tech1', source: 'theory-1', target: 'tech-1', label: '技术支撑', style: { stroke: '#90caf9' } },
    { id: 'e-theory2-tech2', source: 'theory-2', target: 'tech-2', label: '技术支撑', style: { stroke: '#90caf9' } },
    { id: 'e-theory3-tech3', source: 'theory-3', target: 'tech-3', label: '技术支撑', style: { stroke: '#90caf9' } },
    { id: 'e-theory4-tech4', source: 'theory-4', target: 'tech-4', label: '技术支撑', style: { stroke: '#90caf9' } },
    { id: 'e-theory5-tech5', source: 'theory-5', target: 'tech-5', label: '技术支撑', style: { stroke: '#90caf9' } },

    // 技术与应用的关系
    { id: 'e-tech1-app1', source: 'tech-1', target: 'app-1', label: '应用领域', style: { stroke: '#42a5f5' } },
    { id: 'e-tech2-app2', source: 'tech-2', target: 'app-2', label: '应用领域', style: { stroke: '#42a5f5' } },
    { id: 'e-tech3-app3', source: 'tech-3', target: 'app-3', label: '应用领域', style: { stroke: '#42a5f5' } },
    { id: 'e-tech4-app4', source: 'tech-4', target: 'app-4', label: '应用领域', style: { stroke: '#42a5f5' } },
    { id: 'e-tech5-app5', source: 'tech-5', target: 'app-5', label: '应用领域', style: { stroke: '#42a5f5' } },
    { id: 'e-tech1-app6', source: 'tech-1', target: 'app-6', label: '应用领域', style: { stroke: '#42a5f5' } },
  ], []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // 节点点击事件
  const onNodeClick = useCallback((event, node) => {
    console.log('点击节点:', node.data.label);
  }, []);

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        fitView
        minZoom={0.2}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
      >
        <Controls
          className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg shadow-sm"
          position="top-right"
        />
        <MiniMap
          nodeColor={(node) => {
            if (node.id === 'core') return '#bbdefb';
            if (node.id.startsWith('theory')) return '#f5f5f5';
            if (node.id.startsWith('tech')) return '#e3f2fd';
            return '#eeeeee';
          }}
          nodeStrokeColor={(node) => {
            if (node.id === 'core') return '#1e88e5';
            if (node.id.startsWith('theory')) return '#757575';
            if (node.id.startsWith('tech')) return '#42a5f5';
            return '#9e9e9e';
          }}
          position="bottom-right"
          className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg shadow-sm"
        />
        <Background color="#cbd5e1" gap={20} />
        <Panel position="top-left" className="bg-white/90 backdrop-blur-sm p-3 rounded-lg border border-gray-200 shadow-sm">
          <div className="text-sm font-semibold text-gray-700">
            城乡规划学科知识图谱
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default UrbanPlanningKnowledgeGraph;