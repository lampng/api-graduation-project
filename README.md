# API GRADUATION PROJECT
 - API LINK: https://api-graduation-project-production.up.railway.app/
## Overview
API này đóng vai trò là phần phụ trợ cho dự án tốt nghiệp, cung cấp các endpoints để quản lý người dùng, thông tin khách hàng, dịch vụ, giỏ hàng và đơn đặt hàng.

### USER

- Đăng ký - chỉ dành cho admin
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
| `avatar` | `Blob` | **Not required**.|
| `status` | `Boolean` | **Not required**.|


- Đổi mật khẩu
```http
  PUT /user/change-password/${id} = id của người dùng
```
| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `oldpassword` | `string` | **Required**.|
| `password` | `string` | **Required**.|

- Quên mật khẩu
```http
  GET /user/forgot-password
```
| QUERY | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Required**.|

- Verify Email
```http
  POST /user/verify-confirmation-code
```
| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Required**. email ở phần quên mật khẩu|
| `confirmationCode` | `string` | **Required**. mã xác thực ở trong mail|

- Verify Email
```http
  PUT /user/reset-password
```
| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Required**. email ở phần quên mật khẩu|
| `newPassword` | `string` | **Required**. Mật khẩu mới|


- Xoá người dùng
```http
  DELETE /user/delete/${id} = id của người dùng
```


- Gọi danh sách người dùng
```http
  GET /user/list
```

- Thêm lương cho người dùng
```http
  POST /user/salary/:id
```
| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `year` | `string` | **Required**.|
| `month` | `string` | **Required**.|
| `salary` | `number` | **Required**.|
| `bonus` | `number` | **Required**.|

- Gọi danh sách lương người dùng
```http
  GET /user/salary/:id
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**.|

| QUERY | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `year` | `string` | **Not required**.|
| `month` | `string` | **Not required**.|

- Cập nhập lương người dùng
```http
  PUT /user/salary/:id
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**.|

| QUERY | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `year` | `string` | **Required**.|
| `month` | `string` | **Required**.|

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `salary` | `number` | **Required**.|
| `bonus` | `number` | **Required**.|

- Xoá lương người dùng
```http
  DELETE /user/salary/:id
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**.|

| QUERY | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `year` | `string` | **Required**.|
| `month` | `string` | **Required**.|

### CLIENT

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

### SERVICE

- Tạo dịch vụ
```http
  POST /service/create
```

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `name` | `string` | **Required**.|
| `description` | `string` | **Required**.|
| `price` | `string` | **Required**.|
| `quantityImage` | `string` | **Required**.|
| `image` | `Blob` | **Required**.|
```bash
- Khi nhập đủ thông tin vào tạo, sẽ kiểm tra `name` trên cơ sở dữ liệu
- Nếu `name` đã tồn tại trên hệ thống thì sẽ báo lỗi
```

- Cập nhập dịch vụ
```http
  PUT /service/update/:id = `id` của dịch vụ
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**.|

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `name` | `string` | **Not required**.|
| `description` | `string` | **Not required**.|
| `price` | `string` | **Not required**.|
| `quantityImage` | `string` | **Not required**.|
| `image` | `Blob` | **Not required**.|

- Xoá dịch vụ
```http
  DELETE /service/delete/:id = `id` của dịch vụ
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**.|

- Danh sách dịch vụ
```http
  GET /service/list/:id = `id` của dịch vụ
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**.|

- Chi tiết dịch vụ
```http
  GET /service/detail/:id = `id` của dịch vụ
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**.|

### CART

- Thêm dịch vụ vào giỏ hàng
```http
  POST /cart/addServiceToCart
```

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `userID` | `string` | **Required**.|
| `serviceID` | `string` | **Required**.|
```bash
- Mỗi dịch vụ chỉ duy nhất trong giỏ hàng
```

- Xoá dịch vụ khỏi giỏ hàng
```http
  DELETE /cart/removeServiceFromCart
```

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `userID` | `string` | **Required**.|
| `serviceID` | `string` | **Required**.|

- Thêm nhân viên vào giỏ hàng
```http
  POST /cart/addStaffToCart/:id = id người dùng
```

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `serviceID` | `string` | **Required**.|
| `staffID` | `string` | **Required**.|

- Xoá nhân viên khỏi giỏ hàng
```http
  DELETE /cart/removeStaffFromCart/:id = id người dùng
```

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `serviceID` | `string` | **Required**.|
| `staffID` | `string` | **Required**.|


- Gọi danh sách giỏ hàng của người dùng
```http
  GET /cart/list/:id = id người dùng
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `userID` | `string` | **Required**.|

### ORDER

- Xác nhận đơn hàng
```http
  POST /order/comfirmOrder/:id = id Người dùng
```

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `serviceID` | `string` | **Required**. Id của dịch vụ muốn xác nhận|
| `client` | `string` | **Required**. khách hàng|
| `started` | `string` | **Required**.DD/MM/YYYY|
| `deadline` | `string` | **Required**.DD/MM/YYYY|
| `location` | `string` | **Required**.|
| `note` | `string` | **Not required**. ghi chú|
| `status` | `string` | **Not required**. Trạng thái đơn hàng|

- Xoá đơn hàng
```http
  DELETE /order/delete/:id = id của đơn hàng
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**.|

- Cập nhập đơn hàng
```http
  PUT /order/update/:id = id của đơn hàng
```

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `status` | `string` | **Not required**. Default: 'Chưa thực hiện'|
| `started` | `string` | **Required**. HH:mm DD/MM/YYYY|
| `deadline` | `string` | **Required**.DD/MM/YYYY|
| `location` | `string` | **Required**.|
| `note` | `string` | **Not required**. ghi chú|


- Danh sách đơn hàng
```http
  GET /order/list
```

- Danh sách đơn hàng của người dùng
```http
  GET /order/listOfUser
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `userID` | `string` | **Required**.|

- Danh sách công việc của nhân viên
```http
  GET /order/listOfStaff
```
| QUERY | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `staffID` | `string` | **Required**.|
