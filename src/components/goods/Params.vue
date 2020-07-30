<template>
 <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片区域 -->
    <el-card>
      <!-- 头部警告区域 -->
      <el-alert :closable="false" show-icon
        title="注意：只允许为第三级分类设置参数" type="warning">
      </el-alert>
      <el-row>
        <el-col>
          <span>选择商品分类</span>
          <!-- 级联选择框 -->
          <el-cascader clearable
            :options="cateList"
            :props='cateProps'
            v-model="selectedKeysId"
            @change="handleChange">
          </el-cascader>
        </el-col>
      </el-row>
      <!-- tag页签区域 -->
      <el-tabs v-model="activeName" @tab-click='handleTabClick'>
        <el-tab-pane name="many" label="动态参数">
          <!-- 添加动态参数面板 -->
          <el-button type="primary" size="mini" :disabled="isBtnDisabled"
          @click="addDialogVisible=true">添加参数</el-button>
          <!-- 动态属性表格 -->
          <el-table
            :data="manyTableData" border stripe>
            <el-table-column type="expand">
              <template v-slot='scope'>
                <!-- 循环渲染tag -->
                <el-tag v-for="(item,index) in scope.row.attr_vals"
                 :key="index" closable @close="handleClose(index,scope.row)" >{{item}}</el-tag>
                <!-- 输入的标签 -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible"
                v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称" >
            </el-table-column>
            <el-table-column label="操作">
              <template v-slot='scope'>
                <el-button type="primary" icon="el-icon-edit" size="mini"
                @click="showEidtDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type="primary" icon="el-icon-delete" size="mini"
                @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane name="only" label="静态属性">
          <!-- 添加静态属性面板 -->
          <el-button type="primary" size="mini" :disabled="isBtnDisabled"
          @click="addDialogVisible=true">添加属性</el-button>
          <!-- 静态属性表格 -->
          <el-table
            :data="onlyTableData" border stripe>
            <el-table-column type="expand">
              <template v-slot='scope'>
                <!-- 循环渲染tag -->
                <el-tag v-for="(item,index) in scope.row.attr_vals"
                 :key="index" closable @close="handleClose(index,scope.row)" >{{item}}</el-tag>
                <!-- 输入的标签 -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible"
                v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称" >
            </el-table-column>
            <el-table-column label="操作">
              <template v-slot='scope'>
                <el-button type="primary" icon="el-icon-edit" size="mini"
                @click="showEidtDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type="primary" icon="el-icon-delete" size="mini"
                @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <!-- 表s格 -->
      <!-- 分页区域 -->
    </el-card>
    <!-- 添加参数的对话框 -->
    <el-dialog :title="'添加'+titleText" @close="addDialogClosed"
      :visible.sync="addDialogVisible" width="50%">
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改参数对话框 -->
    <el-dialog :title="'修改'+titleText" @close="editDialogClosed"
      :visible.sync="editDialogVisible" width="50%">
      <el-form ref="editFormRef" :model="editForm" :rules="editFormRules">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </div>
    </el-dialog>
 </div>
</template>

<script>
export default {
  name: 'Params',
  created () {
    this.getCateList()
  },
  computed: {
    // 禁用按钮
    isBtnDisabled () {
      if (this.selectedKeysId.length !== 3) { return true }
      return false
    },
    catId () {
      if (this.selectedKeysId.length === 3) { return this.selectedKeysId[2] }
      return null
    },
    titleText () {
      if (this.activeName === 'many') { return '动态参数' } else { return '静态属性' }
    }
  },
  data () {
    return {
      // 分类数据
      cateList: [],
      // 级联选择框的配置对象
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选中的ID值
      selectedKeysId: [],
      // tag页签名称
      activeName: 'many',
      // 动态属性的数据
      manyTableData: [],
      // 静态属性的数据
      onlyTableData: [],
      // 控制对话框
      addDialogVisible: false,
      editDialogVisible: false,
      // 添加表单数据的对象
      addForm: {
        attr_name: ''
      },
      editForm: {
        attr_name: ''
      },
      // 表单验证
      addFormRules: {
        attr_name: [{
          required: true, message: '请输入名称', trigger: 'blur'
        }]
      },
      editFormRules: {
        attr_name: [{
          required: true, message: '请输入名称', trigger: 'blur'
        }]
      }
    }
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) { return this.$message.error('获取商品分类失败') }
      this.cateList = res.data
    },
    async handleChange () {
      if (this.selectedKeysId.length !== 3) {
        this.selectedKeysId = []
        this.manyTableData = []
        this.onlyTableData = []
      }
      this.getParamsData()
    },
    handleTabClick () {
      this.getParamsData()
    },
    async getParamsData () {
      // 根据分类ID，和面板获取参数
      const { data: res } = await this.$http.get(`categories/${this.catId}/attributes`,
        { params: { sel: this.activeName } })
      if (res.meta.status !== 200) { return this.$message.error('获取失败') }
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 控制文本框的显示与隐藏
        item.inputVisible = false
        // 文本框中输入的值
        item.inputValue = ''
      })
      console.log(res.data)
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    // 对话框关闭
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 为商品添加参数
    addParams () {
      this.$refs.addFormRef.validate(async vaild => {
        if (!vaild) return
        const { data: res } = await this.$http.post(`categories/${this.catId}/attributes`,
        // 参数
          { attr_sel: this.activeName, attr_name: this.addForm.attr_name })

        if (res.meta.status !== 201) { return this.$message.error('添加参数失败') }
        this.$message.success('添加参数成功')
        this.addDialogVisible = false
        this.getParamsData()
        console.log(res)
      })
    },
    // 点击按钮展示修改
    async showEidtDialog (attrId) {
      const { data: res } = await this.$http.get(`categories/${this.catId}/attributes/${attrId}`,
        { params: { attr_sel: this.activeName } })
      if (res.meta.status !== 200) { return this.$message.error('获取参数失败') }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    editParams () {
      this.$refs.editFormRef.validate(async vaild => {
        if (!vaild) return
        const { data: res } = await this.$http.put(`categories/${this.catId}/attributes/${this.editForm.attr_id}`,
        // 参数
          { attr_sel: this.activeName, attr_name: this.editForm.attr_name })

        if (res.meta.status !== 200) { return this.$message.error('添加参数失败') }
        this.$message.success('添加参数成功')
        this.editDialogVisible = false
        this.getParamsData()
      })
    },
    async removeParams (attrId) {
      const confirmResult = await this.$confirm('是否删除？', '确认信息', {
        type: 'warning',
        confirmButtonText: '删除',
        cancelButtonText: '取消'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除')
      }
      const { data: res } = await this.$http.delete(`categories/${this.catId}/attributes/${attrId}`)
      if (res.meta.status !== 200) { return this.$message.error('删除参数失败') }
      this.$message.success('删除参数成功')
      this.getParamsData()
    },
    // 文本框失去焦点或者按下enter
    async handleInputConfirm (row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      // 输入内容的后续处理
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.saveAttrVals(row)
    },
    async saveAttrVals (row) {
      // 发起网络请求，提交修改数据
      const { data: res } = await this.$http.put(`categories/${this.catId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        })
      if (res.meta.status !== 200) { return this.$message.error('修改参数失败') }
      this.$message.success('修改参数成功')
    },
    // 点击按钮显示文本框
    showInput (row) {
      row.inputVisible = true
      // 自动获得焦点
      this.$nextTick(_ => {
        this.$refs.saveTagInput.focus()
      })
    },
    // 删除标签
    handleClose (i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    }
  }
}
</script>

<style scoped lang = "css">
.el-alert{
  margin: 15px 0;

}
.el-cascader{
  margin-left: 15px;
  width: 25%;
}
.el-tag{
  margin: 0 5px;
}
.input-new-tag{
  width: 120px;
}
.el-table{
  margin-top: 15px;
}
</style>
