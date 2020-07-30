<template>
 <div>
<!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
        <el-row>
          <el-col>
            <el-button type="primary" @click="addRolesDialogVisible = 'true'">添加角色</el-button>
          </el-col>
        </el-row>
        <el-table :data="roleslist" border stripe style="width: 100%">
          <el-table-column type="expand">
            <template v-slot='rolesInfo'>
              <el-row v-for="(item1,i1) in rolesInfo.row.children" :key="item1.id"
              :class="['bdbottom',i1===0?'bdtop':'','vcenter']">
                <!-- 一级权限 -->
                <el-col :span="5">
                  <el-tag closable @close="removeRightById(rolesInfo.row,item1.id)">{{item1.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 二级权限 -->
                <el-col :span="19">
                  <el-row v-for="(item2,i2) in item1.children" :key="item2.id"
                  :class="[i2===0?'':'bdtop','vcenter']">
                    <el-col :span="6">
                      <el-tag type="success" closable @close="removeRightById(rolesInfo.row,item2.id)">{{item2.authName}}</el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <!-- 三级权限 -->
                    <el-col :span="18">
                      <el-tag v-for="(item3,i3) in item2.children" closable @close="removeRightById(rolesInfo.row,item3.id)"
                      type="warning" :key="item3.id" :class="[i3===0?'':'bdtop']">{{item3.authName}}</el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column type="index"></el-table-column>
          <el-table-column
            prop="roleName"
            label="角色名称">
          </el-table-column>
          <el-table-column
            prop="roleDesc"
            label="角色描述">
          </el-table-column>
          <el-table-column label="角色操作">
            <template v-slot='info'>
              <el-button type="primary" icon="el-icon-eidt" size="mini"
              @click="editRolesById(info.row.id)">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini"
              @click="removeRolesById(info.row.id)">删除</el-button>
              <el-button type="warning" icon="el-icon-setting" size="mini"
              @click="showSetRightDiaolog(info.row)">分配权限</el-button>
            </template>
          </el-table-column>
        </el-table>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog
       title="添加角色"
       :visible.sync="addRolesDialogVisible" @close="addDiaoClosed"
       width="50%">
      <el-form ref="addFormRolesRef" label-width="80px" :model="addForm"
      :rules="addFormRolesRules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input placeholder="请输入角色名称" v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input placeholder="请输入角色描述" v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑 -->
    <el-dialog title="编辑角色信息" :visible.sync="editDialogVisible"
      width="50%" @close='editDialogClosed'>
      <el-form :model="editForm" :rules="addFormRolesRules" ref="editFormRolesRef" label-width="70px">
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span>
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRolesInfo(editForm.roleId)">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog
       title="分配权限"
       :visible.sync="setRightDialogVisible"
       width="50%" @close='setRightDialogClosed'>
      <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id"
      :default-checked-keys='defKeys' ref='treeRef'>
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
 </div>
</template>

<script>
export default {
  created () {
    this.getRolesData()
  },
  name: 'Roles',
  data () {
    return {
      roleslist: [],
      addRolesDialogVisible: false,
      editDialogVisible: false,
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      editForm: {},
      addFormRolesRules: {
        roleName: [{ required: true, message: '请输入角色名', trigger: 'blur' }],
        roleDesc: [{ message: '请输入角色描述', trigger: 'blur' }]
      },
      // 分配权限框的显示与隐藏
      setRightDialogVisible: false,
      rightsList: [],
      // 树形控件
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的节点数组
      defKeys: [],
      // 当前将要分配权限的ID
      roleId: ''
    }
  },
  methods: {
    // 获取数据
    async getRolesData () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色信息失败')
      }
      this.roleslist = res.data
    },
    // 关闭弹框
    addDiaoClosed () {
      this.$refs.addFormRolesRef.resetFields()
    },
    // 编辑对话框
    async editRolesById (id) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询信息失败')
      }
      console.log(res.data)
      this.editForm = res.data
    },
    // 关闭编辑对话框
    editDialogClosed () {
      this.$refs.editFormRolesRef.resetFields()
    },
    // 添加角色
    addRoles () {
      this.$refs.addFormRolesRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('roles', this.addForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加角色失败')
        }
        this.$message.success(res.meta.msg)
        this.addRolesDialogVisible = false
        this.getRolesData()
      })
    },
    // 删除
    async removeRolesById (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已经取消')
      }
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      this.getRolesData()
    },
    // 提交编辑
    editRolesInfo (id) {
      this.$refs.editFormRolesRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('roles/' + id, this.editForm)
        if (res.meta.status !== 200) {
          return this.$message.error('失败')
        }
        this.$message.success('成功')
        this.editDialogVisible = false
        this.getRolesData()
      })
    },
    // 根据id删除权限
    async removeRightById (role, right) {
      // 弹框是否删除
      const confirmResult = await this.$confirm('此操作将永久删除该权限，是否继续', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除')
      }
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${right}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      role.children = res.data
      this.$message.success('删除成功')
    },
    // 展示分配权限的对话框
    async showSetRightDiaolog (role) {
      this.roleId = role.id
      this.setRightDialogVisible = true
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) { return this.$message.error('获取信息失败') }
      this.rightsList = res.data
      this.getLeafKeys(role, this.defKeys)
    },
    getLeafKeys (node, arr) {
      // 不包含node.children的话就是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    // 分配权限对话框关闭
    setRightDialogClosed () {
      this.defKeys = []
    },
    // 为角色分配权限
    async allotRights () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) { return this.$message.error('失败') }
      this.$message.success('成功')
      this.getRolesData()
      this.setRightDialogVisible = false
    }
  }
}
</script>

<style scoped lang = "css">
.el-breadcrumb{
  margin-bottom: 15px;
  font-size: 15px;
}
.el-table{
  margin-top: 25px;
}
.el-tag{
  margin: 7px;
}
.bdtop{
  border-top:1px solid #eee ;
}
.bdbottom{
  border-bottom: 1px solid #eee;
}
.vcenter{
  display: flex;
  align-items: center;
}
</style>
