<template>
 <div>
<!-- 面包屑导航 -->
   <el-breadcrumb separator-class="el-icon-arrow-right">
     <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
     <el-breadcrumb-item>订单管理</el-breadcrumb-item>
     <el-breadcrumb-item>订单列表</el-breadcrumb-item>
   </el-breadcrumb>
    <!--卡片区域 -->
    <el-card>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单数据 -->
      <el-table :data="orderList" border stripe >
        <el-table-column type="index" width="30px"></el-table-column>
        <el-table-column prop="order_number" label="订单编号" ></el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="90px" header-align="center" align="center"></el-table-column>
        <el-table-column label="是否付款" width="120px" header-align="center" align="center">
          <template v-slot='scope'>
            <el-tag type="success" v-if="scope.row.pay_status==='1'" >已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"  width="90px" header-align="center" align="center"></el-table-column>
        <el-table-column prop="create_time" label="下单时间" width="160px" header-align="center">
          <template v-slot="scope">
            {{scope.row.create_time|dataFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160px" header-align="center" align="center">
          <template>
            <el-button type="primary" icon="el-icon-edit" size="mini"
            @click="showBox"></el-button>
            <el-button type="success" icon="el-icon-location" size="mini"
            @click="showProgressBox"></el-button>
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
    <!-- 修改地址对话 -->
    <el-dialog title="修改地址" @close="addressDialogClosed"
      :visible.sync="addressDialogVisible"
      width="50%">
      <el-form ref="addressFormRef" :model="addressForm" label-width="100px" :rules="addressFormRules">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="cityData" clearable
            v-model="addressForm.address1">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressDialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 物流进度对话框 -->
    <el-dialog
      title="物流进度"
      :visible.sync="progressDialogVisible" width="50%" >
      <div>
        <el-timeline>
          <el-timeline-item v-for="(item,index) in progressInfo" :key="index">
            <el-card>
              <h4>{{item.context}}</h4>
              <p>{{item.time}}</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-dialog>
 </div>
</template>

<script>
import cityData from './citydata.js'
export default {
  name: 'Order',
  data () {
    return {
      // 查询信息
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 总数
      total: 0,
      orderList: [],
      // 默认对话框关闭
      addressDialogVisible: false,
      progressDialogVisible: false,
      // 地址信息
      addressForm: {
        address1: [],
        address2: ''
      },
      // 物流信息
      progressInfo: '',
      // 规则
      addressFormRules: {
        address1: [{ required: true, message: '请选择地址', trigger: 'blur' }],
        address2: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
      },
      cityData
    }
  },
  methods: {
    async getOrderList () {
      const { data: res } = await this.$http.get('orders', { params: this.queryInfo })
      if (res.meta.status !== 200) { return this.$message.error('获取信息失败') }
      this.orderList = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange (newsize) {
      this.queryInfo.pagesize = newsize
      this.getOrderList()
    },
    handleCurrentChange (newpage) {
      this.queryInfo.pagenum = newpage
      this.getOrderList()
    },
    // 展示修改地址
    showBox () {
      this.addressDialogVisible = true
    },
    // 关闭对话框
    addressDialogClosed () {
      this.$refs.addressFormRef.resetFields()
    },
    // 物流信息
    async showProgressBox () {
      const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      if (res.meta.status !== 200) { return this.$message.error('获取物流信息失败') }
      this.progressInfo = res.data
      this.progressDialogVisible = true
    }
  },
  created () {
    this.getOrderList()
  }

}
</script>

<style scoped lang = "css">
.el-cascader{
  width: 100%;
}
</style>
