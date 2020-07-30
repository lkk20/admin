/* eslint-disable no-unused-expressions */
<template>
<el-container class="home-container">
  <!-- 头部 -->
  <el-header>
    <div>
      <div class= 'el-icon-s-operation'></div>
      <span>电商后台管理项目</span>
    </div>
    <el-button type="info" @click="loginOut">退出</el-button>
  </el-header>
  <el-container>
<!-- 侧边 -->
    <el-aside :width="flag?'60px':'200px'">
      <div class="toggle-button" @click="toggleCollapse">|||</div>
      <!-- 侧边栏菜单 -->
      <el-menu background-color="#333744" text-color="#fff"
      active-text-color="#409020" unique-opened :collapse='flag'
      :collapse-transition="false" router :default-active="activePath">
        <!-- 一级菜单 -->
        <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
          <!-- 一级菜单模板 -->
          <template slot="title">
            <i :class="itemIcon[item.id]" class="iconfont"></i>
            <span>{{item.authName}}</span>
          </template>
          <!-- 二级菜单 -->
          <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children"
          :key="subItem.id" @click="saveNavState('/'+subItem.path)">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>{{subItem.authName}}</span>
          </template>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
<!-- 右侧 -->
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</template>

<script>

export default {
  data () {
    return {
      menuList: [],
      itemIcon: {
        125: 'el-icon-user-solid',
        103: 'el-icon-s-goods',
        101: 'el-icon-success',
        102: 'el-icon-s-help',
        145: 'el-icon-help'
      },
      flag: false,
      // 被激活链接地址
      activePath: ''
    }
  },
  components: {

  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  name: 'vueName',
  methods: {
    loginOut () {
      window.sessionStorage.clear()
      this.$router.replace('/login')
    },
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    toggleCollapse () {
      // 切换菜单折叠与展开
      this.flag = !this.flag
    },
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style scoped lang = "css">
.home-container{
  height: 100%;
  width: 100%;
}
.el-header{
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left:0 ;
  align-items: center;
  color: #fff;
  font-size: 20px;
}
.el-header>div{
  display: flex;
  align-items: center;
  margin-left: 15px;
}
.el-icon-s-operation{
  margin-right: 15px;
}
.el-aside{
  background-color: #333744;

}
.el-main{
  background-color: #eaedf1;
}
.el-menu{
  border-right: none;
}
.iconfont{
  margin-right: 20px;
}
.toggle-button{
  width: 100%;
  height: 30px;
  line-height: 30px;
  text-align: center;
  background-color: gray;
  cursor: pointer;
}
</style>
