<template>
 <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table :data="pagedata" style="width: 100%" border stripe>
        <el-table-column label="序号" type="index" width="50px"></el-table-column>
        <el-table-column
              prop="authName"
              label="权限名称">
        </el-table-column>
        <el-table-column
              prop="path"
              label="路径">
        </el-table-column>
        <el-table-column
              prop="level"
              label="权限等级">
          <template v-slot='levelInfo'>
            <el-tag v-if="levelInfo.row.level==='0'">一级</el-tag>
            <el-tag type="success" v-if="levelInfo.row.level==='1'">二级</el-tag>
            <el-tag type="warning" v-if="levelInfo.row.level==='2'">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page.sync="queryInfo.pagenum" :page-size="queryInfo.pagesize" :page-sizes="[7, 15, 25,35]"
      layout="total,sizes, prev, pager, next,jumper" :total="total">
      </el-pagination>
    </el-card>
 </div>
</template>

<script>
export default {
  created () {
    this.getRightsList()
  },
  name: 'Rights',
  data () {
    return {
      rightsList: [],
      total: 0,
      pagedata: [],
      queryInfo: {
        pagenum: 1,
        pagesize: 7
      }
    }
  },
  methods: {
    // 请求数据
    async getRightsList (page = 0, n = this.queryInfo.pagesize) {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) {
        return this.$message.error('请求权限列表失败')
      }
      // 保存数据
      this.rightsList = res.data
      console.log(this.rightsList)
      // 分割数据
      this.pagedata = this.rightsList.slice(page, n)
      console.log(this.pagedata)
      // 总条数
      this.total = res.data.length
    },
    // 切换显示条数
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getRightsList()
    },
    // 切换当前页
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getRightsList((newPage - 1) * this.queryInfo.pagesize, newPage * this.queryInfo.pagesize)
    }
  }
}
</script>

<style scoped lang = "css">

</style>
