<template>
 <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query"
          clearable @clear='getGoodsList'>
            <el-button slot="append"  icon="el-icon-search"
            @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="goodsList" border stripe >
        <el-table-column header-align="center" align="center" type="index">
        </el-table-column>
        <el-table-column label="商品名称" prop="goods_name" header-align="center">
        </el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" header-align="center" width="120px" align="center">
        </el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" header-align="center" width="90px" align="center">
        </el-table-column>
        <el-table-column label="创建时间" header-align="center" width="150px" align="center">
          <template v-slot='scope'>
            {{scope.row.add_time|dataFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" header-align="center" width="120px" align="center">
          <template v-slot='scope'>
            <el-button type="primary" icon="el-icon-edit" size="mini"
            ></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"
            @click="removeById(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination  @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
      </el-pagination>
    </el-card>
 </div>
</template>

<script>
export default {
  name: 'Goods',
  created () {
    this.getGoodsList()
  },
  data () {
    return {
      // 分页数据
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 商品列表
      goodsList: [],
      total: 0
    }
  },
  methods: {
    // 根据分页获取数据
    async getGoodsList () {
      this.queryInfo.query = this.queryInfo.query.trim()
      const { data: res } = await this.$http.get('goods', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据失败')
      }
      this.goodsList = res.data.goods
      this.total = res.data.total
      console.log(res.data)
    },
    // 切换显示的条数
    handleSizeChange (newsize) {
      this.queryInfo.pagesize = newsize
      this.getGoodsList()
    },
    // 切换当前页
    handleCurrentChange (newpage) {
      this.queryInfo.pagenum = newpage
      this.getGoodsList()
    },
    // 删除
    async removeById (goodsId) {
      const confirmResult = await this.$confirm('检测到要删除内容，是否要删除？', '确认信息', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已经取消删除')
      }
      const { data: res } = await this.$http.delete(`goods/${goodsId}`)
      if (res.meta.status !== 200) { return this.$message.error('删除失败') }
      this.$message.success('删除成功')
      this.getGoodsList()
    },
    goAddPage () {
      this.$router.push('/goods/add')
    }
  }
}
</script>

<style scoped lang = "css">
.el-row{
  margin-bottom: 15px;
}
</style>
