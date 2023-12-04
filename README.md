# API GRADUATION PROJECT
 - API LINK: https://api-graduation-project.vercel.app/

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


- Xoá người dùng
```http
  DELETE /user/delete/${id} = id của người dùng
```


- Gọi danh sách người dùng
```http
  GET /user/list
```

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
  POST /cart/addStaffToCart
```

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `userID` | `string` | **Required**.|
| `staffID` | `string` | **Required**.|

- Xoá nhân viên khỏi giỏ hàng
```http
  DELETE /cart/removeStaffFromCart
```

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `userID` | `string` | **Required**.|
| `staffID` | `string` | **Required**.|


- Gọi danh sách giỏ hàng của người dùng
```http
  GET /cart/list/${id} = id người dùng
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `userID` | `string` | **Required**.|
### ORDER

- Xác nhận đơn hàng
```http
  POST /order/comfirmOrder
```

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `userID` | `string` | **Required**. userID của người tạo đơn|
| `client` | `string` | **Required**. khách hàng|
| `started` | `string` | **Required**.|
| `deadline` | `string` | **Required**.|
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
| `started` | `string` | **Required**.|
| `deadline` | `string` | **Required**.|
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
