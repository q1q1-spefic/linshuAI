import React, { useEffect, useRef, useState } from 'react';
import { Card, Input, Select, Button, Space, Typography, Tooltip, Drawer, Badge } from 'antd';
import { 
  SearchOutlined, 
  FullscreenOutlined, 
  ReloadOutlined,
  InfoCircleOutlined,
  ShareAltOutlined,
  ZoomInOutlined,
  ZoomOutOutlined
} from '@ant-design/icons';
import * as d3 from 'd3';
import './KnowledgeGraph.css';

const { Search } = Input;
const { Option } = Select;
const { Title, Paragraph, Text } = Typography;

// 中医知识图谱数据
const sampleGraphData = {
  nodes: [
    // 核心脏腑
    { id: 'heart', name: '心', type: 'organ', category: '脏腑', level: 1 },
    { id: 'liver', name: '肝', type: 'organ', category: '脏腑', level: 1 },
    { id: 'spleen', name: '脾', type: 'organ', category: '脏腑', level: 1 },
    { id: 'lung', name: '肺', type: 'organ', category: '脏腑', level: 1 },
    { id: 'kidney', name: '肾', type: 'organ', category: '脏腑', level: 1 },
    
    // 生理功能
    { id: 'shuaixue', name: '主血脉', type: 'function', category: '生理功能', level: 2 },
    { id: 'cangsheng', name: '藏神', type: 'function', category: '生理功能', level: 2 },
    { id: 'shuxie', name: '主疏泄', type: 'function', category: '生理功能', level: 2 },
    { id: 'cangxue', name: '藏血', type: 'function', category: '生理功能', level: 2 },
    { id: 'yunhua', name: '主运化', type: 'function', category: '生理功能', level: 2 },
    { id: 'tongsheng', name: '统血', type: 'function', category: '生理功能', level: 2 },
    { id: 'zhiqi', name: '主气', type: 'function', category: '生理功能', level: 2 },
    { id: 'xuanfa', name: '宣发', type: 'function', category: '生理功能', level: 2 },
    { id: 'cangzang', name: '主藏精', type: 'function', category: '生理功能', level: 2 },
    { id: 'zhushui', name: '主水', type: 'function', category: '生理功能', level: 2 },
    
    // 病理状态
    { id: 'qixue_yugui', name: '气滞血瘀', type: 'pathology', category: '病理', level: 3 },
    { id: 'ganyu_qizhi', name: '肝郁气滞', type: 'pathology', category: '病理', level: 3 },
    { id: 'pixu', name: '脾虚', type: 'pathology', category: '病理', level: 3 },
    { id: 'shenyang_xu', name: '肾阳虚', type: 'pathology', category: '病理', level: 3 },
    { id: 'feiqi_xu', name: '肺气虚', type: 'pathology', category: '病理', level: 3 },
    
    // 症状
    { id: 'xiongxie_zhang', name: '胸胁胀痛', type: 'symptom', category: '症状', level: 4 },
    { id: 'qingzhi_bu_shu', name: '情志不舒', type: 'symptom', category: '症状', level: 4 },
    { id: 'shishao', name: '食少', type: 'symptom', category: '症状', level: 4 },
    { id: 'fatigue', name: '乏力', type: 'symptom', category: '症状', level: 4 },
    { id: 'kechi', name: '咳嗽', type: 'symptom', category: '症状', level: 4 },
    
    // 治法
    { id: 'shugan_liqi', name: '疏肝理气', type: 'treatment', category: '治法', level: 5 },
    { id: 'jianpi_yiqi', name: '健脾益气', type: 'treatment', category: '治法', level: 5 },
    { id: 'buyang_yishen', name: '补阳益肾', type: 'treatment', category: '治法', level: 5 },
    
    // 方剂
    { id: 'xiaoyao_san', name: '逍遥散', type: 'formula', category: '方剂', level: 6 },
    { id: 'sijunzi_tang', name: '四君子汤', type: 'formula', category: '方剂', level: 6 },
    { id: 'jinkui_shenqi_wan', name: '金匮肾气丸', type: 'formula', category: '方剂', level: 6 }
  ],
  
  links: [
    // 脏腑与功能
    { source: 'heart', target: 'shuaixue', type: 'function', strength: 1 },
    { source: 'heart', target: 'cangsheng', type: 'function', strength: 1 },
    { source: 'liver', target: 'shuxie', type: 'function', strength: 1 },
    { source: 'liver', target: 'cangxue', type: 'function', strength: 1 },
    { source: 'spleen', target: 'yunhua', type: 'function', strength: 1 },
    { source: 'spleen', target: 'tongsheng', type: 'function', strength: 1 },
    { source: 'lung', target: 'zhiqi', type: 'function', strength: 1 },
    { source: 'lung', target: 'xuanfa', type: 'function', strength: 1 },
    { source: 'kidney', target: 'cangzang', type: 'function', strength: 1 },
    { source: 'kidney', target: 'zhushui', type: 'function', strength: 1 },
    
    // 功能失常与病理
    { source: 'shuxie', target: 'ganyu_qizhi', type: 'pathology', strength: 0.8 },
    { source: 'yunhua', target: 'pixu', type: 'pathology', strength: 0.8 },
    { source: 'cangzang', target: 'shenyang_xu', type: 'pathology', strength: 0.8 },
    { source: 'zhiqi', target: 'feiqi_xu', type: 'pathology', strength: 0.8 },
    
    // 病理与症状
    { source: 'ganyu_qizhi', target: 'xiongxie_zhang', type: 'symptom', strength: 0.9 },
    { source: 'ganyu_qizhi', target: 'qingzhi_bu_shu', type: 'symptom', strength: 0.9 },
    { source: 'ganyu_qizhi', target: 'qixue_yugui', type: 'development', strength: 0.7 },
    { source: 'pixu', target: 'shishao', type: 'symptom', strength: 0.8 },
    { source: 'pixu', target: 'fatigue', type: 'symptom', strength: 0.8 },
    { source: 'feiqi_xu', target: 'kechi', type: 'symptom', strength: 0.8 },
    
    // 治法与方剂
    { source: 'shugan_liqi', target: 'xiaoyao_san', type: 'prescription', strength: 0.9 },
    { source: 'jianpi_yiqi', target: 'sijunzi_tang', type: 'prescription', strength: 0.9 },
    { source: 'buyang_yishen', target: 'jinkui_shenqi_wan', type: 'prescription', strength: 0.9 },
    
    // 病理与治法
    { source: 'ganyu_qizhi', target: 'shugan_liqi', type: 'treatment', strength: 0.9 },
    { source: 'pixu', target: 'jianpi_yiqi', type: 'treatment', strength: 0.9 },
    { source: 'shenyang_xu', target: 'buyang_yishen', type: 'treatment', strength: 0.9 }
  ]
};

const KnowledgeGraph = () => {
  const svgRef = useRef();
  const [selectedNode, setSelectedNode] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [graphData, setGraphData] = useState(sampleGraphData);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  // 初始化图谱
  useEffect(() => {
    initializeGraph();
    
    // 监听窗口大小变化
    const handleResize = () => {
      const container = svgRef.current?.parentElement;
      if (container) {
        setDimensions({
          width: container.clientWidth,
          height: container.clientHeight
        });
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 重新渲染图谱当数据或尺寸变化时
  useEffect(() => {
    if (svgRef.current) {
      renderGraph();
    }
  }, [graphData, dimensions, filterCategory, searchTerm]);

  const initializeGraph = () => {
    // 这里可以从API加载真实的知识图谱数据
    // 目前使用样例数据
    setGraphData(sampleGraphData);
  };

  const renderGraph = () => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const { width, height } = dimensions;
    
    // 过滤数据
    const filteredNodes = graphData.nodes.filter(node => {
      const matchesSearch = searchTerm === '' || 
        node.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || 
        node.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
    
    const filteredNodeIds = new Set(filteredNodes.map(d => d.id));
    const filteredLinks = graphData.links.filter(link => 
      filteredNodeIds.has(link.source.id || link.source) && 
      filteredNodeIds.has(link.target.id || link.target)
    );

    // 创建力导向模拟
    const simulation = d3.forceSimulation(filteredNodes)
      .force("link", d3.forceLink(filteredLinks).id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(30));

    // 创建缩放行为
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        container.attr("transform", event.transform);
      });

    svg.call(zoom);

    // 创建主容器
    const container = svg.append("g").attr("class", "graph-container");

    // 绘制连线
    const links = container.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(filteredLinks)
      .enter().append("line")
      .attr("stroke", d => getLinkColor(d.type))
      .attr("stroke-width", d => Math.sqrt(d.strength * 3))
      .attr("stroke-opacity", 0.6);

    // 绘制节点
    const nodes = container.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(filteredNodes)
      .enter().append("g")
      .attr("class", "node")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    // 节点圆圈
    nodes.append("circle")
      .attr("r", d => getNodeSize(d.type))
      .attr("fill", d => getNodeColor(d.type))
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .on("click", (event, d) => handleNodeClick(d))
      .on("mouseover", (event, d) => handleNodeHover(event, d))
      .on("mouseout", handleNodeOut);

    // 节点标签
    nodes.append("text")
      .text(d => d.name)
      .attr("text-anchor", "middle")
      .attr("dy", d => getNodeSize(d.type) + 15)
      .attr("font-size", "12px")
      .attr("font-weight", "500")
      .attr("fill", "#333");

    // 更新位置
    simulation.on("tick", () => {
      links
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      nodes.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    // 拖拽函数
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  };

  // 获取节点颜色
  const getNodeColor = (type) => {
    const colors = {
      organ: '#52c41a',      // 脏腑 - 绿色
      function: '#1677ff',   // 功能 - 蓝色
      pathology: '#ff4d4f',  // 病理 - 红色
      symptom: '#faad14',    // 症状 - 橙色
      treatment: '#722ed1',  // 治法 - 紫色
      formula: '#13c2c2'     // 方剂 - 青色
    };
    return colors[type] || '#666';
  };

  // 获取连线颜色
  const getLinkColor = (type) => {
    const colors = {
      function: '#52c41a',
      pathology: '#ff4d4f',
      symptom: '#faad14',
      treatment: '#722ed1',
      prescription: '#13c2c2',
      development: '#f759ab'
    };
    return colors[type] || '#999';
  };

  // 获取节点大小
  const getNodeSize = (type) => {
    const sizes = {
      organ: 20,
      function: 15,
      pathology: 18,
      symptom: 12,
      treatment: 16,
      formula: 14
    };
    return sizes[type] || 10;
  };

  // 处理节点点击
  const handleNodeClick = (node) => {
    setSelectedNode(node);
    setDrawerVisible(true);
  };

  // 处理节点悬停
  const handleNodeHover = (event, node) => {
    // 可以添加tooltip或高亮效果
  };

  const handleNodeOut = () => {
    // 移除悬停效果
  };

  // 重置图谱
  const resetGraph = () => {
    setSearchTerm('');
    setFilterCategory('all');
    setSelectedNode(null);
    initializeGraph();
  };

  // 获取分类选项
  const categories = ['all', ...new Set(graphData.nodes.map(node => node.category))];

  return (
    <div className="knowledge-graph-container">
      {/* 控制面板 */}
      <Card className="control-panel" size="small">
        <Space wrap>
          <Search
            placeholder="搜索概念..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 200 }}
            prefix={<SearchOutlined />}
          />
          
          <Select
            value={filterCategory}
            onChange={setFilterCategory}
            style={{ width: 120 }}
          >
            <Option value="all">全部分类</Option>
            {categories.filter(cat => cat !== 'all').map(category => (
              <Option key={category} value={category}>{category}</Option>
            ))}
          </Select>
          
          <Button 
            icon={<ReloadOutlined />} 
            onClick={resetGraph}
            title="重置图谱"
          />
          
          <Button 
            icon={<FullscreenOutlined />} 
            title="全屏显示"
          />
          
          <Button 
            icon={<ZoomInOutlined />} 
            title="放大"
          />
          
          <Button 
            icon={<ZoomOutOutlined />} 
            title="缩小"
          />
        </Space>
      </Card>

      {/* 图谱主区域 */}
      <div className="graph-main">
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          className="knowledge-graph-svg"
        />
        
        {/* 图例 */}
        <Card className="legend" size="small">
          <Title level={5}>图例</Title>
          <div className="legend-items">
            {[
              { type: 'organ', label: '脏腑', color: '#52c41a' },
              { type: 'function', label: '功能', color: '#1677ff' },
              { type: 'pathology', label: '病理', color: '#ff4d4f' },
              { type: 'symptom', label: '症状', color: '#faad14' },
              { type: 'treatment', label: '治法', color: '#722ed1' },
              { type: 'formula', label: '方剂', color: '#13c2c2' }
            ].map(item => (
              <div key={item.type} className="legend-item">
                <Badge color={item.color} />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 节点详情抽屉 */}
      <Drawer
        title={selectedNode?.name}
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={400}
      >
        {selectedNode && (
          <div>
            <Paragraph>
              <Text strong>类型：</Text> {selectedNode.category}
            </Paragraph>
            <Paragraph>
              <Text strong>级别：</Text> 第{selectedNode.level}层
            </Paragraph>
            <Paragraph>
              <InfoCircleOutlined style={{ marginRight: 8 }} />
              这是关于"{selectedNode.name}"的详细信息。在实际应用中，这里会显示从知识库中检索到的详细说明、相关理论、临床应用等内容。
            </Paragraph>
            
            <Button 
              type="primary" 
              icon={<ShareAltOutlined />}
              style={{ marginTop: 16 }}
            >
              探索相关概念
            </Button>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default KnowledgeGraph;