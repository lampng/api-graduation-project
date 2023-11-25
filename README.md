# API GRADUATION PROJECT
 - [Base route](https://api-graduation-project.vercel.app/)

## API Reference

### USER

- Đăng ký - chỉ dành cho quản lý và admin
```http
  POST /user/register
```
| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `name` | `string` | **Required**.|
| `email` | `string` | **Required**.|
| `role` | `string` | **Required**.|
| Nếu `role` có giá trị là là `Nhân viên` thì có thêm:|
| `job` | `string` | **Required**.|


- Đăng nhập
```http
  POST /user/login
```
| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Required**.|
| `password` | `string` | **Required**.|


- Đăng xuất
```http
  GET /user/logout/${id} = session id login
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**. |


- Cập nhập người dùng
```http
  PUT /user/update/${id} = id của người dùng
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**.|

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `name` | `string` | **Not required**.|
| `email` | `string` | **Not required**.|
| `address` | `string` | **Not required**.|
| `phone` | `string` | **Not required**.|
| `birthday` | `string` | **Not required**.|
| `citizenIdentityCard` | `string` | **Not required**.|
| `gender` | `string` | **Not required**.|
| `role` | `string` | **Not required**.|
| `role` | `string` | **Not required**.|
| `avatar` | `BLOB` | **Not required**.|


- Đổi mật khẩu
```http
  PUT /user/change-password/${id} = id của người dùng
```
| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `oldpassword` | `string` | **Required**.|
| `password` | `string` | **Required**.|


- Xoá người dùng
```http
  DELETE /user/delete/${id} = id của người dùng
```


- Gọi danh sách người dùng
```http
  GET /user/list
```

### Client

- Thêm khách hàng mới
```http
  POST /client/create
```
| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `name` | `string` | **Required**.|
| `address` | `string` | **Required**.|
| `phone` | `string` | **Required**.|
| `gender` | `string` | **Required**.|
| `creatorID` | `number` | **Required**.|


- Gọi danh sách khách hàng
```http
  GET /client/list
```


- Gọi chi tiết khách hàng
```http
  GET /client/detail/${id} = id của khách hàng
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**.|


- Cập nhập khách hàng
```http
  PUT /client/update/${id} = id của khách hàng
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**.|

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `name` | `string` | **Required**.|
| `address` | `string` | **Required**.|
| `phone` | `string` | **Required**.|
| `gender` | `string` | **Required**.|


- Xoá khách hàng
```http
  DELETE /client/delete/${id} = id của khách hàng
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**.|
