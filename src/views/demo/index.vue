<template>
  <div id="app-container">
    <!-- 操作区 -->
    <div class="filter-container">
      <el-input
        style="width: 200px"
        v-model="queryParams.name"
        @keyup.enter.native="handleSearch"
      />
      <el-button type="primary" icon="el-icon-search" @click="handleSearch"
        >搜索</el-button
      >
      <el-button type="primary" @click="handleAdd">添加</el-button>
      <el-button type="danger" @click="handleDelete">删除</el-button>
      <el-button type="info" @click="handleBack">请求后端</el-button>
    </div>

    <!-- 表格区 -->
    <template>
      <div id="table-container">
        <el-table
          ref="dataTable"
          :data="list"
          v-loading="isLoading"
          border
          fit
          stripe
          highlight-current-row
          style="width: 100%"
          @selection-change="selectChange"
        >
          <!-- 表头 -->
          <el-table-column type="selection" width="40" />
          <el-table-column label="字段1" prop="col1" align="center" fixed />
          <el-table-column label="字段2" prop="col2" align="center" fixed />
          <el-table-column label="字段3" prop="col3" align="center" fixed>
            <template slot-scope="scope">
              <span>{{ scope.row.col3 ? "是" : "否" }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" fixed>
            <template slot-scope="scope">
              <el-button @click="handleEdit(scope.row)" type="text">
                编辑
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </template>

    <!-- 分页器 -->
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="sizes,prev,pager,next"
        :page-sizes="this.sizes"
        :page-size="this.size"
        :total="this.total"
        background
        hide-on-single-page
      />
    </div>

    <!-- 编辑窗口 -->
    <el-dialog :title="titleMap[dialogStatus]" :visible.sync="dialogVisable">
      <el-form
        ref="editForm"
        :model="temp"
        label-position="right"
        :inline-message="true"
        style="width: 100%"
      >
        <el-form-item label="Col1" prop="col1">
          <el-input v-model="temp.col1" />
        </el-form-item>
        <el-form-item label="Col2" prop="col2">
          <el-input v-model="temp.col2" />
        </el-form-item>
        <el-form-item label="Col3" prop="col3">
          <el-radio-group v-model="temp.col3">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="dialogStatus === 'create' ? createData() : updateData()"
          >
            完成
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { findDemo, insertDemo, updateDemo, deleteDemo, getBack } from "@/api/demo";

export default {
  name: "Demo",
  data() {
    return {
      list: [],
      current: 1,
      pages: 0,
      sizes: [10, 20, 50, 100],
      size: 10,
      total: 0,
      isLoading: false,
      temp: {
        col1: "",
        col2: "",
        col3: true,
      },
      queryParams: {
        name: "",
      },
      dialogVisable: false,
      dialogStatus: "",
      titleMap: {
        update: "编辑",
        create: "添加",
      },
      selected: [],
    };
  },

  mounted() {
    this.initData();
  },

  methods: {
    initData(current = this.current, size = this.size) {
      this.isLoading = true;
      let params = {
        current: current,
        size: size,
      };
      findDemo(params).then((res) => {
        this.pages = res.data.pages;
        this.total = res.data.total;
        this.list = res.data.list;
        this.isLoading = false;
      });
    },

    handleSearch() {
      this.isLoading = true;
      findDemo(this.queryParams).then((res) => {
        this.current = res.data.current;
        this.size = res.data.size;
        this.pages = res.data.pages;
        this.total = res.data.total;
        this.list = res.data.list;
        this.isLoading = false;
      });
    },

    selectChange(data) {
      this.selected = data;
    },

    resetTemp() {
      this.temp = {
        col1: "",
        col2: "",
        col3: true,
      };
    },

    handleAdd() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogVisable = true;
    },

    handleEdit(row) {
      this.temp = Object.assign({}, row);
      this.dialogStatus = "update";
      this.dialogVisable = true;
    },

    createData() {
      insertDemo(this.temp).then((res) => {
        if (res.data.resCode === 200) {
          this.$notify.success({ message: res.data.message });
          this.initData();
          this.dialogVisable = false;
        } else {
          this.$notify.error({ message: res.data.message });
        }
      });
    },

    updateData() {
      updateDemo(this.temp).then((res) => {
        if (res.data.resCode === 200) {
          this.$notify.success({ message: res.data.message });
          this.initData();
          this.dialogVisable = false;
        } else {
          this.$notify.error({ message: res.data.message });
        }
      });
    },

    handleDelete() {
      const selectedId = [];
      this.selected.forEach((item) => {
        selectedId.push(item.id);
      });
      if (selectedId.length) {
        this.$confirm("确定删除所选项？").then(() => {
          deleteDemo(selectedId).then((res) => {
            if (res.data.resCode === 200) {
              this.$notify.success({ message: res.data.message });
              this.initData();
              this.dialogVisable = false;
            } else {
              this.$notify.error({ message: res.data.message });
            }
          });
        });
      } else {
        this.$notify.warning({ message: "请选择一条记录" });
      }
    },

    handleBack() {
      getBack().then( () => {
        console.log("请求后端接口")
      })
    },

    handleSizeChange(val) {
      this.size = val;
      this.initData();
    },

    handleCurrentChange(val) {
      this.current = val;
      this.initData();
    },
  },
};
</script>

<style></style>
