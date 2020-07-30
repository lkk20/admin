<template>
 <div>
   <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCatDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table :data="categoriesList" :columns="columns"
      :selection-type='false' :expand-type='false' show-index border>
      <!-- 是否有效 -->
      <template slot='isok' slot-scope='scope'>
        <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color:lightgreen"></i>
        <i class="el-icon-error" v-else style="color:lightred"></i>
      </template>
      <!-- 排序 -->
       <template slot='order' slot-scope='scope'>
         <el-tag type="mini" v-if="scope.row.cat_level===0">一级</el-tag>
         <el-tag type="success" v-else-if="scope.row.cat_level===1" size="mini">二级</el-tag>
         <el-tag type="warning" v-else size="mini">三级</el-tag>
      </template>
      <!-- 操作 -->
      <template slot='opt'>
         <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
         <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
      </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 15, 30, 60]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加分类的对话框 -->
    <el-dialog title="添加分类" @close="addCatDialogClosed"
      :visible.sync="addCatDialogVisible" width="50%">
      <el-form ref="cateForm" :model="addCateForm" label-width="80px" :rules='addCateFormRules'>
        <el-form-item label="分类名称" prop="cat_name" >
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader v-model="selectedKeys" :options="parentsCategoriesList"
          @change="parentCateChange" :props="cascaderProps" clearable  ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addCatDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </div>
    </el-dialog>
 </div>
</template>

<script>
export default {
  name: 'Categories',
  created () {
    // 商品分类数据
    this.getCategoriesList()
  },
  data () {
    return {
      // 商品分类数据
      categoriesList: [],
      total: 0,
      columns: [{
        label: '分类名称',
        prop: 'cat_name'
      }, {
        label: '是否有效',
        type: 'template',
        template: 'isok'
      },
      {
        label: '排序',
        type: 'template',
        template: 'order'
      },
      {
        label: '操作',
        type: 'template',
        template: 'opt'
      }
      ],
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 对话框的显示与隐藏
      addCatDialogVisible: false,
      // 添加分类的数据对象
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      // 添加分类校验规则
      addCateFormRules: {
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      // 父级分类列表
      parentsCategoriesList: [],
      // 制定级联选择器的对象
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选中对象的id
      selectedKeys: []
    }
  },
  methods: {
    // 商品分类数据
    async getCategoriesList () {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取信息失败')
      }
      this.categoriesList = res.data.result
      this.total = res.data.total
    },
    // 监听pagesize改变事件
    handleSizeChange (newsize) {
      this.queryInfo.pagesize = newsize
      this.getCategoriesList()
    },
    // 监听pagenum改变事件
    handleCurrentChange (newpage) {
      this.queryInfo.pagenum = newpage
      this.getCategoriesList()
    },
    // 点击按钮展示添加分类的对话框
    showAddCatDialog () {
      // 获取父级分类的数据列表
      this.getParentsCategoriesList()
      this.addCatDialogVisible = true
    },
    // 获取父级分类的数据列表
    async getParentsCategoriesList () {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据失败')
      }
      console.log(res.data)
      this.parentsCategoriesList = res.data
    },
    // 选择项变化触发函数
    parentCateChange () {
      console.log(this.selectedKeys)
      // 检验是否选择了父级分类，如果selectedKeys数组中的length大于0，
      // 证明选中了父级分类，反之就说说明没有任何父级分类
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addCateForm.cat_level = this.selectedKeys.length
        return
      }
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    // 点击确定添加新的分类
    addCate () {
      this.$refs.cateForm.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        if (res.meta.status !== 201) { return this.$message.error('添加分类失败') }
        this.$message.success('添加分类成功')
        this.getCategoriesList()
        this.addCatDialogVisible = false
      })
    },
    // 关闭表单清空数据
    addCatDialogClosed () {
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
      this.$refs.cateForm.resetFields()
    }
  }
}
</script>

<style scoped lang = "css">
.el-cascader{
  width: 100%;
}
</style>
