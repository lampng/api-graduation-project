# API GRADUATION PROJECT
 - [Base route](https://api-graduation-project.vercel.app/)

## API Reference

#### USER

```http
  POST /user/register
```
- Đăng ký - chỉ dành cho quản lý và admin

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `name` | `string` | **Required**.|
| `email` | `string` | **Required**.|
| `role` | `string` | **Required**.|
| Nếu `role` có giá trị là là `Nhân viên` thì có thêm:|
| `job` | `string` | **Required**.|

```http
  POST /user/login
```
- Đăng nhập

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Required**.|
| `password` | `string` | **Required**.|

```http
  GET /user/logout/${id}
```
- Đăng xuất

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**. session id login|

```http
  PUT /user/update/${id} = id của người dùng
```
- Cập nhập người dùng

| Parameter | Type     | Description                |
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

```http
  PUT /user/change-password/${id} = id của người dùng
```
- Đổi mật khẩu

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `oldpassword` | `string` | **Required**.|
| `password` | `string` | **Required**.|

```http
  DELETE /user/delete/${id} = id của người dùng
```
- Xoá người dùng

```http
  GET /user/list
```
- Gọi danh sách người dùng

```http
  GET /user/list/${id} = id của người dùng
```
- Gọi chi tiết người dùng
