# backend-zamzampool
# cara login
1. buat akun di database dengan role 'super admin' dan status 'active'
2. login pada endpoint http://localhost:PORT_ANTUM/api/auth-login
3. jika sukses akan dapat token, copy tanpa tanda petik("")
4. untuk mengakses endpoint yang perlu authorizeRole, tambahkan token ke auth/bearer, paste disitu.

# ENDPOINT total tiket terjual
api/admin-total/:payment_status

ex: api/admin-total/completed

# Akses akun Midtrans
email: mz78987@gmail.com

pass: Midtranstop123

* Untuk Payment Gateway perhatikan ServerKey, ClientKey
