# ATTEND
This is an API for  ATTEND 

## INSTALLATION

### Installing Dependencies

Run
`yarn install` or `npm i`

### API link

`https://attendence-solvit.herokuapp.com/` 

## Routes Menu

### admin
- [create user](#1-create-user-post-request)
- [admin login](#1-admin-login-post-request)
### user
- [user login](#2-admin-login-post-request)


### 1-create-user-post-request

End Point

```
http://localhost:4500/api/admin/signup
```

Body

```json
{
    "fullname":"arsene merci",
    "phoneNumber":"0781992878",
    "email":"arseneich@gmail.com",
    "gender":"Male",
    "location":"Ruyenzi",
    "role":"admin"
}
Response
```json
  "user": {
    "fullname": "arsene merci",
    "phoneNumber": "0781992878",
    "email": "arseneich@gmail.com",
    "gender": "Male",
    "location": "Ruyenzi",
    "password": "arsen337",
    "role": "admin",
    "_id": "61e92d8a722853236446aa06",
    "__v": 0
  }

```
