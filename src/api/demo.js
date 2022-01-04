import request from "@/utils/request";

export function findDemo(data) {
  return request({
    url: "/demo/find",
    method: "post",
    data,
  });
}

export function insertDemo(data) {
  return request({
    url: "/demo/insert",
    method: "post",
    data,
  });
}

export function updateDemo(data) {
  return request({
    url: "/demo/update",
    method: "post",
    data,
  });
}

export function deleteDemo(data) {
  return request({
    url: "/demo/delete",
    method: "post",
    data,
  });
}

export function getBack() {
  return request({
    url: "/demo/back",
    method: "get"
  })
}
