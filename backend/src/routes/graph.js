import express from 'express';
import { query, validationResult } from 'express-validator';

const router = express.Router();

// 模拟知识图谱数据
const mockGraphData = {
  nodes: [
    // 脏腑
    { id: 'heart', name: '心', type: 'organ', category: '脏腑', level: 1 },
    { id: 'liver', name: '肝', type: 'organ', category: '脏腑', level: 1 },
    { id: 'spleen', name: '脾', type: 'organ', category: '脏腑', level: 1 },
    { id: 'lung', name: '肺', type: 'organ', category: '脏腑', level: 1 },
    { id: 'kidney', name: '肾', type: 'organ', category: '脏腑', level: 1 },
    
    // 功能
    { id: 'shuxie', name: '主疏泄', type: 'function', category: '生理功能', level: 2 },
    { id: 'yunhua', name: '主运化', type: 'function', category: '生理功能', level: 2 },
    { id: 'zhiqi', name: '主气', type: 'function', category: '生理功能', level: 2 },
    
    // 病理
    { id: 'ganyu_qizhi', name: '肝郁气滞', type: 'pathology', category: '病理', level: 3 },
    { id: 'pixu', name: '脾虚', type: 'pathology', category: '病理', level: 3 },
    
    // 治法
    { id: 'shugan_liqi', name: '疏肝理气', type: 'treatment', category: '治法', level: 5 },
    { id: 'jianpi_yiqi', name: '健脾益气', type: 'treatment', category: '治法', level: 5 },
    
    // 方剂
    { id: 'xiaoyao_san', name: '逍遥散', type: 'formula', category: '方剂', level: 6 },
    { id: 'sijunzi_tang', name: '四君子汤', type: 'formula', category: '方剂', level: 6 }
  ],
  
  links: [
    { source: 'liver', target: 'shuxie', type: 'function', strength: 1.0 },
    { source: 'spleen', target: 'yunhua', type: 'function', strength: 1.0 },
    { source: 'lung', target: 'zhiqi', type: 'function', strength: 1.0 },
    { source: 'shuxie', target: 'ganyu_qizhi', type: 'pathology', strength: 0.9 },
    { source: 'yunhua', target: 'pixu', type: 'pathology', strength: 0.9 },
    { source: 'ganyu_qizhi', target: 'shugan_liqi', type: 'treatment', strength: 0.9 },
    { source: 'pixu', target: 'jianpi_yiqi', type: 'treatment', strength: 0.9 },
    { source: 'shugan_liqi', target: 'xiaoyao_san', type: 'prescription', strength: 0.9 },
    { source: 'jianpi_yiqi', target: 'sijunzi_tang', type: 'prescription', strength: 0.9 }
  ]
};

// 获取知识图谱数据
router.get('/knowledge', [
  query('category').optional().isString(),
  query('type').optional().isString(),
  query('limit').optional().isInt({ min: 1, max: 1000 })
], async (req, res) => {
  console.log('📊 获取知识图谱请求:', req.query);
  
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: '参数验证失败',
        details: errors.array()
      });
    }

    const { category, type, limit } = req.query;
    
    let filteredData = { ...mockGraphData };
    
    // 过滤节点
    if (category || type) {
      filteredData.nodes = mockGraphData.nodes.filter(node => {
        const matchesCategory = !category || node.category === category;
        const matchesType = !type || node.type === type;
        return matchesCategory && matchesType;
      });
      
      // 过滤相关的连接
      const nodeIds = new Set(filteredData.nodes.map(n => n.id));
      filteredData.links = mockGraphData.links.filter(link => 
        nodeIds.has(link.source) && nodeIds.has(link.target)
      );
    }
    
    // 限制结果数量
    if (limit) {
      filteredData.nodes = filteredData.nodes.slice(0, parseInt(limit));
    }
    
    console.log('✅ 知识图谱数据返回成功');
    res.json({
      success: true,
      data: filteredData
    });
    
  } catch (error) {
    console.error('❌ 获取知识图谱失败:', error);
    res.status(500).json({
      success: false,
      error: '服务器内部错误'
    });
  }
});

// 搜索概念
router.get('/search', [
  query('query').isString().isLength({ min: 1, max: 100 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
], async (req, res) => {
  console.log('🔍 搜索概念请求:', req.query);
  
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: '参数验证失败',
        details: errors.array()
      });
    }

    const { query: searchQuery, limit = 10 } = req.query;
    
    const results = mockGraphData.nodes.filter(node => 
      node.name.includes(searchQuery) || 
      node.category.includes(searchQuery) ||
      node.type.includes(searchQuery)
    ).slice(0, parseInt(limit));
    
    console.log(`✅ 找到 ${results.length} 个匹配结果`);
    res.json({
      success: true,
      data: {
        query: searchQuery,
        results,
        total: results.length
      }
    });
    
  } catch (error) {
    console.error('❌ 搜索概念失败:', error);
    res.status(500).json({
      success: false,
      error: '服务器内部错误'
    });
  }
});

// 获取概念详情
router.get('/concepts/:id', async (req, res) => {
  console.log('📋 获取概念详情请求:', req.params.id);
  
  try {
    const { id } = req.params;
    
    const concept = mockGraphData.nodes.find(node => node.id === id);
    
    if (!concept) {
      return res.status(404).json({
        success: false,
        error: '概念不存在'
      });
    }
    
    // 模拟详细信息
    const detailedConcept = {
      ...concept,
      description: getConceptDescription(id),
      relatedConcepts: getRelatedConcepts(id),
      sources: getConceptSources(id)
    };
    
    console.log('✅ 概念详情返回成功');
    res.json({
      success: true,
      data: detailedConcept
    });
    
  } catch (error) {
    console.error('❌ 获取概念详情失败:', error);
    res.status(500).json({
      success: false,
      error: '服务器内部错误'
    });
  }
});

// 查找概念间路径
router.post('/path', async (req, res) => {
  console.log('🛤️ 查找路径请求:', req.body);
  
  try {
    const { source, target } = req.body;
    
    if (!source || !target) {
      return res.status(400).json({
        success: false,
        error: '必须提供起始和目标概念'
      });
    }
    
    // 简单的路径查找算法（实际应用中需要更复杂的图算法）
    const path = findShortestPath(source, target);
    
    console.log('✅ 路径查找完成');
    res.json({
      success: true,
      data: {
        source,
        target,
        path,
        pathLength: path ? path.length - 1 : -1
      }
    });
    
  } catch (error) {
    console.error('❌ 查找路径失败:', error);
    res.status(500).json({
      success: false,
      error: '服务器内部错误'
    });
  }
});

// 获取相关概念
router.get('/concepts/:id/related', [
  query('depth').optional().isInt({ min: 1, max: 3 })
], async (req, res) => {
  console.log('🔗 获取相关概念请求:', req.params.id, req.query);
  
  try {
    const { id } = req.params;
    const { depth = 2 } = req.query;
    
    const relatedConcepts = getRelatedConcepts(id, parseInt(depth));
    
    console.log('✅ 相关概念返回成功');
    res.json({
      success: true,
      data: {
        conceptId: id,
        depth: parseInt(depth),
        related: relatedConcepts
      }
    });
    
  } catch (error) {
    console.error('❌ 获取相关概念失败:', error);
    res.status(500).json({
      success: false,
      error: '服务器内部错误'
    });
  }
});

// 辅助函数：获取概念描述
function getConceptDescription(id) {
  const descriptions = {
    'liver': '肝，位于右胁下，为五脏之一。主疏泄，藏血，在中医理论中具有重要地位。',
    'heart': '心，位于胸中，为五脏六腑之大主。主血脉，藏神，为君主之官。',
    'spleen': '脾，位于中焦，为气血生化之源。主运化，统血，为仓廪之官。',
    'lung': '肺，位于胸中，为华盖之脏。主气司呼吸，主宣发肃降，为相傅之官。',
    'kidney': '肾，位于腰部，为先天之本。主藏精，主水液，主纳气，为作强之官。',
    'shuxie': '肝主疏泄，指肝具有疏通、调畅全身气机的功能，影响情志、消化、生殖等。',
    'ganyu_qizhi': '肝郁气滞，指肝失疏泄，气机不畅，常见胸胁胀痛、情志不舒等症状。'
  };
  return descriptions[id] || '这是一个重要的中医概念，详细信息正在完善中。';
}

// 辅助函数：获取相关概念
function getRelatedConcepts(id, depth = 2) {
  const relations = new Map();
  
  // 构建关系映射
  mockGraphData.links.forEach(link => {
    if (!relations.has(link.source)) {
      relations.set(link.source, []);
    }
    if (!relations.has(link.target)) {
      relations.set(link.target, []);
    }
    
    relations.get(link.source).push({
      id: link.target,
      type: link.type,
      strength: link.strength
    });
    
    relations.get(link.target).push({
      id: link.source,
      type: link.type,
      strength: link.strength
    });
  });
  
  const visited = new Set();
  const result = [];
  
  function dfs(nodeId, currentDepth) {
    if (currentDepth >= depth || visited.has(nodeId)) return;
    
    visited.add(nodeId);
    const neighbors = relations.get(nodeId) || [];
    
    neighbors.forEach(neighbor => {
      if (neighbor.id !== id && !visited.has(neighbor.id)) {
        const node = mockGraphData.nodes.find(n => n.id === neighbor.id);
        if (node) {
          result.push({
            ...node,
            relationship: neighbor.type,
            strength: neighbor.strength,
            distance: currentDepth + 1
          });
        }
        
        if (currentDepth + 1 < depth) {
          dfs(neighbor.id, currentDepth + 1);
        }
      }
    });
  }
  
  dfs(id, 0);
  return result.slice(0, 10); // 限制返回数量
}

// 辅助函数：获取概念来源
function getConceptSources(id) {
  return [
    { title: '中医基础理论', author: '印会河', type: '教材' },
    { title: '黄帝内经', type: '经典' },
    { title: '中医诊断学', author: '朱文锋', type: '教材' }
  ];
}

// 辅助函数：查找最短路径
function findShortestPath(source, target) {
  if (source === target) return [source];
  
  const graph = new Map();
  
  // 构建图
  mockGraphData.links.forEach(link => {
    if (!graph.has(link.source)) {
      graph.set(link.source, []);
    }
    if (!graph.has(link.target)) {
      graph.set(link.target, []);
    }
    
    graph.get(link.source).push(link.target);
    graph.get(link.target).push(link.source);
  });
  
  // BFS查找最短路径
  const queue = [[source]];
  const visited = new Set([source]);
  
  while (queue.length > 0) {
    const path = queue.shift();
    const current = path[path.length - 1];
    
    const neighbors = graph.get(current) || [];
    
    for (const neighbor of neighbors) {
      if (neighbor === target) {
        return [...path, neighbor];
      }
      
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([...path, neighbor]);
      }
    }
  }
  
  return null; // 未找到路径
}

export default router;