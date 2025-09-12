import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// 创建axios实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 知识图谱服务类
class GraphService {
  // 获取完整知识图谱
  async getKnowledgeGraph(params = {}) {
    try {
      const response = await apiClient.get('/api/graph/knowledge', { params });
      return response.data;
    } catch (error) {
      console.error('获取知识图谱失败:', error);
      return this.getMockGraphData();
    }
  }

  // 搜索概念
  async searchConcepts(query, limit = 10) {
    try {
      const response = await apiClient.get('/api/graph/search', {
        params: { query, limit }
      });
      return response.data;
    } catch (error) {
      console.error('搜索概念失败:', error);
      return this.getMockSearchResults(query);
    }
  }

  // 获取概念详情
  async getConceptDetails(conceptId) {
    try {
      const response = await apiClient.get(`/api/graph/concepts/${conceptId}`);
      return response.data;
    } catch (error) {
      console.error('获取概念详情失败:', error);
      return this.getMockConceptDetails(conceptId);
    }
  }

  // 查找两个概念之间的路径
  async findPath(sourceId, targetId) {
    try {
      const response = await apiClient.post('/api/graph/path', {
        source: sourceId,
        target: targetId
      });
      return response.data;
    } catch (error) {
      console.error('查找路径失败:', error);
      return this.getMockPath(sourceId, targetId);
    }
  }

  // 获取相关概念
  async getRelatedConcepts(conceptId, depth = 2) {
    try {
      const response = await apiClient.get(`/api/graph/concepts/${conceptId}/related`, {
        params: { depth }
      });
      return response.data;
    } catch (error) {
      console.error('获取相关概念失败:', error);
      return this.getMockRelatedConcepts(conceptId);
    }
  }

  // 模拟知识图谱数据
  getMockGraphData() {
    return {
      success: true,
      data: {
        nodes: [
          // 脏腑系统
          { id: 'heart', name: '心', type: 'organ', category: '脏腑', level: 1, 
            description: '心主血脉，藏神，为君主之官' },
          { id: 'liver', name: '肝', type: 'organ', category: '脏腑', level: 1,
            description: '肝主疏泄，藏血，为将军之官' },
          { id: 'spleen', name: '脾', type: 'organ', category: '脏腑', level: 1,
            description: '脾主运化，统血，为仓廪之官' },
          { id: 'lung', name: '肺', type: 'organ', category: '脏腑', level: 1,
            description: '肺主气，司呼吸，为相傅之官' },
          { id: 'kidney', name: '肾', type: 'organ', category: '脏腑', level: 1,
            description: '肾主藏精，主水，为作强之官' },
          
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
          
          // 症状表现
          { id: 'xiongxie_zhang', name: '胸胁胀痛', type: 'symptom', category: '症状', level: 4 },
          { id: 'qingzhi_bu_shu', name: '情志不舒', type: 'symptom', category: '症状', level: 4 },
          { id: 'shishao', name: '食少', type: 'symptom', category: '症状', level: 4 },
          { id: 'fatigue', name: '乏力', type: 'symptom', category: '症状', level: 4 },
          { id: 'kechi', name: '咳嗽', type: 'symptom', category: '症状', level: 4 },
          { id: 'xinxue_yugui', name: '心血瘀阻', type: 'pathology', category: '病理', level: 3 },
          { id: 'xinyang_xu', name: '心阳虚', type: 'pathology', category: '病理', level: 3 },
          
          // 治疗方法
          { id: 'shugan_liqi', name: '疏肝理气', type: 'treatment', category: '治法', level: 5 },
          { id: 'jianpi_yiqi', name: '健脾益气', type: 'treatment', category: '治法', level: 5 },
          { id: 'buyang_yishen', name: '补阳益肾', type: 'treatment', category: '治法', level: 5 },
          { id: 'yangxin_anshen', name: '养心安神', type: 'treatment', category: '治法', level: 5 },
          { id: 'huoxue_huayu', name: '活血化瘀', type: 'treatment', category: '治法', level: 5 },
          
          // 经典方剂
          { id: 'xiaoyao_san', name: '逍遥散', type: 'formula', category: '方剂', level: 6 },
          { id: 'sijunzi_tang', name: '四君子汤', type: 'formula', category: '方剂', level: 6 },
          { id: 'jinkui_shenqi_wan', name: '金匮肾气丸', type: 'formula', category: '方剂', level: 6 },
          { id: 'gancao_gancao_tang', name: '甘麦大枣汤', type: 'formula', category: '方剂', level: 6 },
          { id: 'danshen_yin', name: '丹参饮', type: 'formula', category: '方剂', level: 6 }
        ],
        
        links: [
          // 脏腑与功能的关系
          { source: 'heart', target: 'shuaixue', type: 'function', strength: 1.0, description: '心主血脉' },
          { source: 'heart', target: 'cangsheng', type: 'function', strength: 1.0, description: '心藏神' },
          { source: 'liver', target: 'shuxie', type: 'function', strength: 1.0, description: '肝主疏泄' },
          { source: 'liver', target: 'cangxue', type: 'function', strength: 1.0, description: '肝藏血' },
          { source: 'spleen', target: 'yunhua', type: 'function', strength: 1.0, description: '脾主运化' },
          { source: 'spleen', target: 'tongsheng', type: 'function', strength: 1.0, description: '脾统血' },
          { source: 'lung', target: 'zhiqi', type: 'function', strength: 1.0, description: '肺主气' },
          { source: 'lung', target: 'xuanfa', type: 'function', strength: 1.0, description: '肺主宣发' },
          { source: 'kidney', target: 'cangzang', type: 'function', strength: 1.0, description: '肾主藏精' },
          { source: 'kidney', target: 'zhushui', type: 'function', strength: 1.0, description: '肾主水' },
          
          // 功能失常导致的病理状态
          { source: 'shuxie', target: 'ganyu_qizhi', type: 'pathology', strength: 0.9, description: '疏泄失职导致肝郁气滞' },
          { source: 'yunhua', target: 'pixu', type: 'pathology', strength: 0.9, description: '运化失职导致脾虚' },
          { source: 'cangzang', target: 'shenyang_xu', type: 'pathology', strength: 0.8, description: '藏精不足导致肾阳虚' },
          { source: 'zhiqi', target: 'feiqi_xu', type: 'pathology', strength: 0.8, description: '主气失职导致肺气虚' },
          { source: 'shuaixue', target: 'xinxue_yugui', type: 'pathology', strength: 0.8, description: '血脉不畅导致心血瘀阻' },
          { source: 'cangsheng', target: 'xinyang_xu', type: 'pathology', strength: 0.7, description: '神不守舍可致心阳虚' },
          
          // 病理状态的相互影响
          { source: 'ganyu_qizhi', target: 'qixue_yugui', type: 'development', strength: 0.8, description: '气滞可导致血瘀' },
          { source: 'pixu', target: 'shenyang_xu', type: 'development', strength: 0.6, description: '脾虚日久可累及肾阳' },
          
          // 病理状态与症状的关系
          { source: 'ganyu_qizhi', target: 'xiongxie_zhang', type: 'symptom', strength: 0.9, description: '肝郁气滞常见胸胁胀痛' },
          { source: 'ganyu_qizhi', target: 'qingzhi_bu_shu', type: 'symptom', strength: 0.9, description: '肝郁气滞导致情志不舒' },
          { source: 'pixu', target: 'shishao', type: 'symptom', strength: 0.8, description: '脾虚导致食少' },
          { source: 'pixu', target: 'fatigue', type: 'symptom', strength: 0.8, description: '脾虚导致乏力' },
          { source: 'feiqi_xu', target: 'kechi', type: 'symptom', strength: 0.8, description: '肺气虚导致咳嗽' },
          
          // 治法与病理的对应关系
          { source: 'ganyu_qizhi', target: 'shugan_liqi', type: 'treatment', strength: 0.9, description: '肝郁气滞治以疏肝理气' },
          { source: 'pixu', target: 'jianpi_yiqi', type: 'treatment', strength: 0.9, description: '脾虚治以健脾益气' },
          { source: 'shenyang_xu', target: 'buyang_yishen', type: 'treatment', strength: 0.9, description: '肾阳虚治以补阳益肾' },
          { source: 'xinyang_xu', target: 'yangxin_anshen', type: 'treatment', strength: 0.8, description: '心阳虚治以养心安神' },
          { source: 'qixue_yugui', target: 'huoxue_huayu', type: 'treatment', strength: 0.9, description: '气滞血瘀治以活血化瘀' },
          
          // 治法与方剂的关系
          { source: 'shugan_liqi', target: 'xiaoyao_san', type: 'prescription', strength: 0.9, description: '疏肝理气代表方剂' },
          { source: 'jianpi_yiqi', target: 'sijunzi_tang', type: 'prescription', strength: 0.9, description: '健脾益气代表方剂' },
          { source: 'buyang_yishen', target: 'jinkui_shenqi_wan', type: 'prescription', strength: 0.9, description: '补阳益肾代表方剂' },
          { source: 'yangxin_anshen', target: 'gancao_gancao_tang', type: 'prescription', strength: 0.8, description: '养心安神代表方剂' },
          { source: 'huoxue_huayu', target: 'danshen_yin', type: 'prescription', strength: 0.8, description: '活血化瘀代表方剂' }
        ]
      }
    };
  }

  // 模拟搜索结果
  getMockSearchResults(query) {
    const allConcepts = this.getMockGraphData().data.nodes;
    const results = allConcepts.filter(node => 
      node.name.includes(query) || node.description?.includes(query)
    );
    
    return {
      success: true,
      data: {
        query,
        results: results.slice(0, 10),
        total: results.length
      }
    };
  }

  // 模拟概念详情
  getMockConceptDetails(conceptId) {
    const mockDetails = {
      'liver': {
        id: 'liver',
        name: '肝',
        type: 'organ',
        category: '脏腑',
        description: '肝，位于右胁下，为五脏之一，在中医理论中具有重要地位。',
        details: {
          physiologicalFunctions: [
            '主疏泄：调节全身气机，影响情志、消化、生殖等',
            '藏血：贮藏血液，调节血液循环',
            '主筋：养筋润燥，主司运动',
            '开窍于目：肝血上注于目，影响视力'
          ],
          pathologicalChanges: [
            '肝郁气滞：情志不舒，胸胁胀痛',
            '肝火上炎：急躁易怒，头痛目赤',
            '肝血虚：视物昏花，肢体麻木',
            '肝阳上亢：头晕头痛，烦躁失眠'
          ],
          clinicalSignificance: '肝在情志调节、消化功能、妇科疾病等方面具有重要作用，是中医辨证论治的重要脏腑。'
        },
        relatedConcepts: ['疏泄', '藏血', '肝郁气滞', '逍遥散'],
        sources: [
          { title: '中医基础理论', author: '印会河', type: '教材' },
          { title: '黄帝内经', type: '经典' }
        ]
      }
    };
    
    return {
      success: true,
      data: mockDetails[conceptId] || {
        id: conceptId,
        name: conceptId,
        description: '概念详情正在完善中...',
        details: {},
        relatedConcepts: [],
        sources: []
      }
    };
  }

  // 模拟路径查找
  getMockPath(sourceId, targetId) {
    return {
      success: true,
      data: {
        source: sourceId,
        target: targetId,
        paths: [
          {
            nodes: [sourceId, 'intermediate1', 'intermediate2', targetId],
            links: [
              { source: sourceId, target: 'intermediate1', type: 'function' },
              { source: 'intermediate1', target: 'intermediate2', type: 'pathology' },
              { source: 'intermediate2', target: targetId, type: 'treatment' }
            ],
            length: 3,
            description: '通过功能失调→病理状态→治疗方法的传变路径'
          }
        ]
      }
    };
  }

  // 模拟相关概念
  getMockRelatedConcepts(conceptId) {
    const mockRelated = {
      'liver': [
        { id: 'shuxie', name: '主疏泄', relationship: '主要功能', strength: 1.0 },
        { id: 'ganyu_qizhi', name: '肝郁气滞', relationship: '常见病理', strength: 0.9 },
        { id: 'xiaoyao_san', name: '逍遥散', relationship: '对应方剂', strength: 0.8 }
      ]
    };
    
    return {
      success: true,
      data: {
        conceptId,
        related: mockRelated[conceptId] || []
      }
    };
  }

  // 生成随机ID
  generateId() {
    return 'concept_' + Math.random().toString(36).substr(2, 9);
  }
}

// 导出单例
export const graphService = new GraphService();
export default graphService;