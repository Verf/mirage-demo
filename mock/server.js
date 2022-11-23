import { createServer, Model, Factory } from 'miragejs';
import { faker } from '@faker-js/faker';

// 模拟后端分页查询
function _pagination(db, params) {
  let current = parseInt(params['current']) - 1;
  let size = parseInt(params['size']);
  let start = current * size;
  let end = start + size;
  let filtered = db.slice(start, end);
  let data = {
    current: current,
    pages: db.length / size,
    size: size,
    total: db.length,
    list: filtered,
  };
  return data;
}

// 模拟后端搜索
function _search(db, params) {
  let name = params['name'];
  if (name) {
    let filtered = db.where({ name: name });
    return {
      current: 1,
      pages: 1,
      size: params.size,
      total: 0,
      list: filtered,
    };
  }
  return _pagination(db, params);
}

// 创建mock服务
export function makeServer({ environment = 'development' } = {}) {
  createServer({
    environment,

    // 数据表
    models: {
      menu: Model,
    },

    // 工厂方法
    factories: {
      menu: Factory.extend({
        name() {
          return faker.internet.userName();
        },
        word() {
          return faker.lorem.words();
        },
        isok() {
          return faker.datatype.boolean();
        },
      }),
    },

    // 数据初始化
    seeds(server) {
      server.createList('menu', 50);
    },

    // 路由拦截
    routes() {
      this.namespace = 'dev-api';

      this.post('/demo/find', (schema, request) => {
        let params = JSON.parse(request.requestBody);
        if (params['name'] && params['name'] !== '') {
          return _search(schema.db.menus, params);
        } else {
          return _pagination(schema.db.menus, params);
        }
      });

      this.post('/demo/insert', (schema, request) => {
        let attrs = JSON.parse(request.requestBody);
        schema.menus.create(attrs);
        return { resCode: 200, message: '插入成功' };
      });

      this.post('/demo/update', (schema, request) => {
        let attrs = JSON.parse(request.requestBody);
        schema.menus.create(attrs);
        return { resCode: 200, message: '更新成功' };
      });

      this.post('/demo/delete', (schema, request) => {
        let attrs = JSON.parse(request.requestBody);
        attrs.forEach(function (id) {
          schema.menus.find(id).destroy();
        });
        return { resCode: 200, message: '删除成功' };
      });

      // 放行未定义的api请求
      this.passthrough();
    },
  });
}
