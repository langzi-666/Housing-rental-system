const { createApp } = Vue;

createApp({
    data() {
        return {
            currentView: 'home',
            currentUser: null,
            houses: [],
            myHouses: [],
            myOrders: [],
            allUsers: [],
            allHouses: [],
            allOrders: [],
            currentHouse: null,
            searchKeyword: '',
            favorites: [],
            reviews: [],
            notifications: [],
            repairs: [],
            unreadCount: 0,
            currentReview: null,
            currentRepair: null,
            userForm: {
                username: '',
                realName: '',
                phone: '',
                email: '',
                role: 'USER'
            },
            stats: {
                totalUsers: 0,
                totalHouses: 0,
                availableHouses: 0,
                totalOrders: 0,
                pendingOrders: 0,
                confirmedOrders: 0,
                userCount: 0,
                landlordCount: 0,
                adminCount: 0
            },
            loginForm: {
                username: '',
                password: ''
            },
            registerForm: {
                username: '',
                password: '',
                realName: '',
                phone: '',
                email: '',
                role: 'USER'
            },
            houseForm: {
                title: '',
                address: '',
                area: '',
                price: '',
                roomType: '',
                floor: '',
                orientation: '',
                description: '',
                facilities: '',
                status: 'AVAILABLE'
            },
            orderForm: {
                rentStartDate: '',
                rentEndDate: ''
            },
            reviewForm: {
                rating: 5,
                content: '',
                orderId: null
            },
            repairForm: {
                title: '',
                description: '',
                houseId: null
            },
            message: '',
            messageType: 'success',
            apiBaseUrl: 'http://localhost:8080/api'
        }
    },
    mounted() {
        this.checkLogin();
        this.loadHouses();
        if (this.currentUser) {
            this.loadUnreadCount();
        }
    },
    methods: {
        checkLogin() {
            const user = localStorage.getItem('currentUser');
            if (user) {
                this.currentUser = JSON.parse(user);
                this.currentView = 'home';
            } else {
                this.currentView = 'login';
            }
        },
        async login() {
            try {
                const response = await axios.post(`${this.apiBaseUrl}/user/login`, this.loginForm);
                if (response.data.code === 200) {
                    this.currentUser = response.data.data.user;
                    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                    this.showMessage('登录成功', 'success');
                    this.loadUnreadCount();
                    this.showHome();
                } else {
                    this.showMessage(response.data.message || '登录失败', 'error');
                }
            } catch (error) {
                this.showMessage('登录失败：' + (error.response?.data?.message || error.message), 'error');
            }
        },
        async register() {
            try {
                const response = await axios.post(`${this.apiBaseUrl}/user/register`, this.registerForm);
                if (response.data.code === 200) {
                    this.showMessage('注册成功，请登录', 'success');
                    this.showLogin();
                } else {
                    this.showMessage(response.data.message || '注册失败', 'error');
                }
            } catch (error) {
                this.showMessage('注册失败：' + (error.response?.data?.message || error.message), 'error');
            }
        },
        logout() {
            localStorage.removeItem('currentUser');
            this.currentUser = null;
            this.currentView = 'login';
            this.showMessage('已退出登录', 'success');
        },
        async loadHouses() {
            try {
                const response = await axios.get(`${this.apiBaseUrl}/house/available`);
                if (response.data.code === 200) {
                    this.houses = response.data.data;
                }
            } catch (error) {
                console.error('加载房屋列表失败', error);
            }
        },
        async searchHouses() {
            try {
                const url = this.searchKeyword 
                    ? `${this.apiBaseUrl}/house/search?keyword=${encodeURIComponent(this.searchKeyword)}`
                    : `${this.apiBaseUrl}/house/available`;
                const response = await axios.get(url);
                if (response.data.code === 200) {
                    this.houses = response.data.data;
                }
            } catch (error) {
                console.error('搜索失败', error);
            }
        },
        async showHouseDetail(houseId) {
            try {
                const response = await axios.get(`${this.apiBaseUrl}/house/${houseId}`);
                if (response.data.code === 200) {
                    this.currentHouse = response.data.data;
                    this.currentView = 'detail';
                    this.orderForm.houseId = houseId;
                }
            } catch (error) {
                this.showMessage('加载房屋详情失败', 'error');
            }
        },
        async createOrder() {
            if (!this.currentHouse) return;
            
            const orderData = {
                houseId: this.currentHouse.id,
                tenantId: this.currentUser.id,
                landlordId: this.currentHouse.landlordId,
                rentStartDate: this.orderForm.rentStartDate,
                rentEndDate: this.orderForm.rentEndDate,
                monthlyRent: this.currentHouse.price
            };

            try {
                const response = await axios.post(`${this.apiBaseUrl}/order`, orderData);
                if (response.data.code === 200) {
                    this.showMessage('订单创建成功', 'success');
                    this.currentHouse.status = 'RENTED';
                    setTimeout(() => {
                        this.showHome();
                        this.loadHouses();
                    }, 1500);
                } else {
                    this.showMessage(response.data.message || '订单创建失败', 'error');
                }
            } catch (error) {
                this.showMessage('订单创建失败：' + (error.response?.data?.message || error.message), 'error');
            }
        },
        async showMyHouses() {
            if (!this.currentUser || this.currentUser.role !== 'LANDLORD') return;
            
            try {
                const response = await axios.get(`${this.apiBaseUrl}/house/landlord/${this.currentUser.id}`);
                if (response.data.code === 200) {
                    this.myHouses = response.data.data;
                    this.currentView = 'myHouses';
                }
            } catch (error) {
                this.showMessage('加载房源失败', 'error');
            }
        },
        showAddHouse() {
            this.houseForm = {
                title: '',
                address: '',
                area: '',
                price: '',
                roomType: '',
                floor: '',
                orientation: '',
                description: '',
                facilities: '',
                status: 'AVAILABLE'
            };
            this.currentView = 'addHouse';
        },
        editHouse(house) {
            this.houseForm = { ...house };
            this.currentView = 'editHouse';
        },
        async saveHouse() {
            const houseData = {
                ...this.houseForm,
                landlordId: this.currentUser.id,
                area: parseFloat(this.houseForm.area),
                price: parseFloat(this.houseForm.price)
            };

            try {
                let response;
                if (this.currentView === 'addHouse') {
                    response = await axios.post(`${this.apiBaseUrl}/house`, houseData);
                } else {
                    response = await axios.put(`${this.apiBaseUrl}/house/${this.houseForm.id}`, houseData);
                }
                
                if (response.data.code === 200) {
                    this.showMessage('保存成功', 'success');
                    setTimeout(() => {
                        this.showMyHouses();
                    }, 1000);
                } else {
                    this.showMessage(response.data.message || '保存失败', 'error');
                }
            } catch (error) {
                this.showMessage('保存失败：' + (error.response?.data?.message || error.message), 'error');
            }
        },
        async deleteHouse(houseId) {
            if (!confirm('确定要删除这个房源吗？')) return;
            
            try {
                const response = await axios.delete(`${this.apiBaseUrl}/house/${houseId}`);
                if (response.data.code === 200) {
                    this.showMessage('删除成功', 'success');
                    this.showMyHouses();
                } else {
                    this.showMessage(response.data.message || '删除失败', 'error');
                }
            } catch (error) {
                this.showMessage('删除失败：' + (error.response?.data?.message || error.message), 'error');
            }
        },
        async showMyOrders() {
            if (!this.currentUser) return;
            
            try {
                const url = this.currentUser.role === 'LANDLORD'
                    ? `${this.apiBaseUrl}/order/landlord/${this.currentUser.id}`
                    : `${this.apiBaseUrl}/order/tenant/${this.currentUser.id}`;
                const response = await axios.get(url);
                if (response.data.code === 200) {
                    this.myOrders = response.data.data || [];
                    this.currentView = 'myOrders';
                } else {
                    this.showMessage(response.data.message || '加载订单失败', 'error');
                }
            } catch (error) {
                console.error('加载订单失败:', error);
                this.showMessage('加载订单失败：' + (error.response?.data?.message || error.message), 'error');
            }
        },
        async confirmOrder(orderId) {
            try {
                const response = await axios.put(`${this.apiBaseUrl}/order/${orderId}/confirm`);
                if (response.data.code === 200) {
                    this.showMessage('订单确认成功', 'success');
                    this.showMyOrders();
                } else {
                    this.showMessage(response.data.message || '确认失败', 'error');
                }
            } catch (error) {
                this.showMessage('确认失败：' + (error.response?.data?.message || error.message), 'error');
            }
        },
        async cancelOrder(orderId) {
            if (!confirm('确定要取消这个订单吗？')) return;
            
            try {
                const response = await axios.put(`${this.apiBaseUrl}/order/${orderId}/cancel`);
                if (response.data.code === 200) {
                    this.showMessage('订单取消成功', 'success');
                    this.showMyOrders();
                } else {
                    this.showMessage(response.data.message || '取消失败', 'error');
                }
            } catch (error) {
                this.showMessage('取消失败：' + (error.response?.data?.message || error.message), 'error');
            }
        },
        showLogin() {
            this.currentView = 'login';
        },
        showRegister() {
            this.currentView = 'register';
        },
        showHome() {
            this.currentView = 'home';
            this.loadHouses();
        },
        getStatusText(status) {
            const statusMap = {
                'AVAILABLE': '可租',
                'RENTED': '已租',
                'OFFLINE': '下架'
            };
            return statusMap[status] || status;
        },
        getOrderStatusText(status) {
            const statusMap = {
                'PENDING': '待确认',
                'CONFIRMED': '已确认',
                'COMPLETED': '已完成',
                'CANCELLED': '已取消'
            };
            return statusMap[status] || status;
        },
        showMessage(msg, type = 'success') {
            this.message = msg;
            this.messageType = type;
            setTimeout(() => {
                this.message = '';
            }, 3000);
        },
        // 管理员功能
        async showAdminUsers() {
            if (!this.currentUser || this.currentUser.role !== 'ADMIN') return;
            
            try {
                const response = await axios.get(`${this.apiBaseUrl}/user/list`);
                if (response.data.code === 200) {
                    this.allUsers = response.data.data;
                    this.currentView = 'adminUsers';
                }
            } catch (error) {
                this.showMessage('加载用户列表失败', 'error');
            }
        },
        editUser(user) {
            this.userForm = { ...user };
            this.currentView = 'editUser';
        },
        async saveUser() {
            try {
                const response = await axios.put(`${this.apiBaseUrl}/user/${this.userForm.id}`, this.userForm);
                if (response.data.code === 200) {
                    this.showMessage('保存成功', 'success');
                    setTimeout(() => {
                        this.showAdminUsers();
                    }, 1000);
                } else {
                    this.showMessage(response.data.message || '保存失败', 'error');
                }
            } catch (error) {
                this.showMessage('保存失败：' + (error.response?.data?.message || error.message), 'error');
            }
        },
        async deleteUser(userId) {
            if (!confirm('确定要删除这个用户吗？此操作不可恢复！')) return;
            
            try {
                const response = await axios.delete(`${this.apiBaseUrl}/user/${userId}`);
                if (response.data.code === 200) {
                    this.showMessage('删除成功', 'success');
                    this.showAdminUsers();
                } else {
                    this.showMessage(response.data.message || '删除失败', 'error');
                }
            } catch (error) {
                this.showMessage('删除失败：' + (error.response?.data?.message || error.message), 'error');
            }
        },
        async showAdminHouses() {
            if (!this.currentUser || this.currentUser.role !== 'ADMIN') return;
            
            try {
                const response = await axios.get(`${this.apiBaseUrl}/house/list`);
                if (response.data.code === 200) {
                    this.allHouses = response.data.data;
                    this.currentView = 'adminHouses';
                }
            } catch (error) {
                this.showMessage('加载房源列表失败', 'error');
            }
        },
        adminEditHouse(house) {
            this.houseForm = { ...house };
            this.currentView = 'adminEditHouse';
        },
        async adminSaveHouse() {
            const houseData = {
                ...this.houseForm,
                area: parseFloat(this.houseForm.area),
                price: parseFloat(this.houseForm.price)
            };

            try {
                const response = await axios.put(`${this.apiBaseUrl}/house/${this.houseForm.id}`, houseData);
                if (response.data.code === 200) {
                    this.showMessage('保存成功', 'success');
                    setTimeout(() => {
                        this.showAdminHouses();
                    }, 1000);
                } else {
                    this.showMessage(response.data.message || '保存失败', 'error');
                }
            } catch (error) {
                this.showMessage('保存失败：' + (error.response?.data?.message || error.message), 'error');
            }
        },
        async adminDeleteHouse(houseId) {
            if (!confirm('确定要删除这个房源吗？')) return;
            
            try {
                const response = await axios.delete(`${this.apiBaseUrl}/house/${houseId}`);
                if (response.data.code === 200) {
                    this.showMessage('删除成功', 'success');
                    this.showAdminHouses();
                } else {
                    this.showMessage(response.data.message || '删除失败', 'error');
                }
            } catch (error) {
                this.showMessage('删除失败：' + (error.response?.data?.message || error.message), 'error');
            }
        },
        async showAdminOrders() {
            if (!this.currentUser || this.currentUser.role !== 'ADMIN') return;
            
            try {
                const response = await axios.get(`${this.apiBaseUrl}/order/list`);
                if (response.data.code === 200) {
                    this.allOrders = response.data.data;
                    this.currentView = 'adminOrders';
                }
            } catch (error) {
                this.showMessage('加载订单列表失败', 'error');
            }
        },
        async showAdminStats() {
            if (!this.currentUser || this.currentUser.role !== 'ADMIN') return;
            
            try {
                // 加载统计数据
                const [usersRes, housesRes, ordersRes] = await Promise.all([
                    axios.get(`${this.apiBaseUrl}/user/list`),
                    axios.get(`${this.apiBaseUrl}/house/list`),
                    axios.get(`${this.apiBaseUrl}/order/list`)
                ]);

                const users = usersRes.data.code === 200 ? usersRes.data.data : [];
                const houses = housesRes.data.code === 200 ? housesRes.data.data : [];
                const orders = ordersRes.data.code === 200 ? ordersRes.data.data : [];

                this.stats = {
                    totalUsers: users.length,
                    totalHouses: houses.length,
                    availableHouses: houses.filter(h => h.status === 'AVAILABLE').length,
                    totalOrders: orders.length,
                    pendingOrders: orders.filter(o => o.status === 'PENDING').length,
                    confirmedOrders: orders.filter(o => o.status === 'CONFIRMED').length,
                    userCount: users.filter(u => u.role === 'USER').length,
                    landlordCount: users.filter(u => u.role === 'LANDLORD').length,
                    adminCount: users.filter(u => u.role === 'ADMIN').length
                };

                this.currentView = 'adminStats';
            } catch (error) {
                this.showMessage('加载统计数据失败', 'error');
            }
        },
        getRoleText(role) {
            const roleMap = {
                'USER': '租客',
                'LANDLORD': '房东',
                'ADMIN': '管理员'
            };
            return roleMap[role] || role;
        },
        formatDate(dateString) {
            if (!dateString) return '-';
            const date = new Date(dateString);
            return date.toLocaleString('zh-CN');
        },
        // 收藏模块
        async showMyFavorites() {
            if (!this.currentUser) return;
            try {
                const response = await axios.get(`${this.apiBaseUrl}/favorite/user/${this.currentUser.id}`);
                if (response.data.code === 200) {
                    this.favorites = response.data.data;
                    this.currentView = 'myFavorites';
                }
            } catch (error) {
                this.showMessage('加载收藏列表失败', 'error');
            }
        },
        async toggleFavorite(houseId) {
            if (!this.currentUser) {
                this.showMessage('请先登录', 'error');
                return;
            }
            try {
                const checkResponse = await axios.get(`${this.apiBaseUrl}/favorite/check/${this.currentUser.id}/${houseId}`);
                const isFavorite = checkResponse.data.data.isFavorite;
                
                if (isFavorite) {
                    await axios.delete(`${this.apiBaseUrl}/favorite/${this.currentUser.id}/${houseId}`);
                    this.showMessage('取消收藏成功', 'success');
                } else {
                    await axios.post(`${this.apiBaseUrl}/favorite`, {
                        userId: this.currentUser.id,
                        houseId: houseId
                    });
                    this.showMessage('收藏成功', 'success');
                }
            } catch (error) {
                this.showMessage('操作失败：' + (error.response?.data?.message || error.message), 'error');
            }
        },
        async removeFavorite(favoriteId, houseId) {
            if (!confirm('确定要取消收藏吗？')) return;
            try {
                await axios.delete(`${this.apiBaseUrl}/favorite/${this.currentUser.id}/${houseId}`);
                this.showMessage('取消收藏成功', 'success');
                this.showMyFavorites();
            } catch (error) {
                this.showMessage('取消收藏失败', 'error');
            }
        },
        // 评价模块
        async showReviews(houseId) {
            try {
                const response = await axios.get(`${this.apiBaseUrl}/review/house/${houseId}`);
                if (response.data.code === 200) {
                    this.reviews = response.data.data;
                    this.currentView = 'reviews';
                }
            } catch (error) {
                this.showMessage('加载评价失败', 'error');
            }
        },
        async submitReview(houseId, orderId) {
            if (!this.reviewForm.content.trim()) {
                this.showMessage('请输入评价内容', 'error');
                return;
            }
            try {
                const house = this.houses.find(h => h.id === houseId) || this.currentHouse;
                const reviewData = {
                    houseId: houseId,
                    tenantId: this.currentUser.id,
                    landlordId: house.landlordId,
                    orderId: orderId,
                    rating: this.reviewForm.rating,
                    content: this.reviewForm.content
                };
                const response = await axios.post(`${this.apiBaseUrl}/review`, reviewData);
                if (response.data.code === 200) {
                    this.showMessage('评价提交成功', 'success');
                    this.reviewForm = { rating: 5, content: '', orderId: null };
                    this.showReviews(houseId);
                }
            } catch (error) {
                this.showMessage('提交评价失败：' + (error.response?.data?.message || error.message), 'error');
            }
        },
        // 通知模块
        async showNotifications() {
            if (!this.currentUser) return;
            try {
                const response = await axios.get(`${this.apiBaseUrl}/notification/user/${this.currentUser.id}`);
                if (response.data.code === 200) {
                    this.notifications = response.data.data || [];
                    this.currentView = 'notifications';
                } else {
                    this.showMessage(response.data.message || '加载通知失败', 'error');
                }
            } catch (error) {
                console.error('加载通知失败:', error);
                this.showMessage('加载通知失败：' + (error.response?.data?.message || error.message), 'error');
            }
        },
        async loadUnreadCount() {
            if (!this.currentUser) return;
            try {
                const response = await axios.get(`${this.apiBaseUrl}/notification/user/${this.currentUser.id}/unread-count`);
                if (response.data.code === 200) {
                    this.unreadCount = response.data.data.count || 0;
                }
            } catch (error) {
                // 静默失败
            }
        },
        async markNotificationAsRead(notificationId) {
            try {
                await axios.put(`${this.apiBaseUrl}/notification/${notificationId}/read`);
                this.loadUnreadCount();
                this.showNotifications();
            } catch (error) {
                this.showMessage('标记失败', 'error');
            }
        },
        async markAllNotificationsAsRead() {
            try {
                await axios.put(`${this.apiBaseUrl}/notification/user/${this.currentUser.id}/read-all`);
                this.showMessage('全部标记为已读', 'success');
                this.loadUnreadCount();
                this.showNotifications();
            } catch (error) {
                this.showMessage('操作失败', 'error');
            }
        },
        // 维修报修模块
        async showMyRepairs() {
            if (!this.currentUser || this.currentUser.role !== 'USER') return;
            try {
                const response = await axios.get(`${this.apiBaseUrl}/repair/tenant/${this.currentUser.id}`);
                if (response.data.code === 200) {
                    this.repairs = response.data.data;
                    this.currentView = 'myRepairs';
                }
            } catch (error) {
                this.showMessage('加载报修列表失败', 'error');
            }
        },
        async showLandlordRepairs() {
            if (!this.currentUser || this.currentUser.role !== 'LANDLORD') return;
            try {
                const response = await axios.get(`${this.apiBaseUrl}/repair/landlord/${this.currentUser.id}`);
                if (response.data.code === 200) {
                    this.repairs = response.data.data;
                    this.currentView = 'landlordRepairs';
                }
            } catch (error) {
                this.showMessage('加载报修列表失败', 'error');
            }
        },
        showAddRepair(houseId) {
            this.repairForm = {
                title: '',
                description: '',
                houseId: houseId
            };
            this.currentView = 'addRepair';
        },
        async submitRepair() {
            if (!this.repairForm.title.trim()) {
                this.showMessage('请输入报修标题', 'error');
                return;
            }
            try {
                const house = this.houses.find(h => h.id === this.repairForm.houseId) || this.currentHouse;
                const repairData = {
                    houseId: this.repairForm.houseId,
                    tenantId: this.currentUser.id,
                    landlordId: house.landlordId,
                    title: this.repairForm.title,
                    description: this.repairForm.description
                };
                const response = await axios.post(`${this.apiBaseUrl}/repair`, repairData);
                if (response.data.code === 200) {
                    this.showMessage('报修提交成功', 'success');
                    this.repairForm = { title: '', description: '', houseId: null };
                    this.showMyRepairs();
                }
            } catch (error) {
                this.showMessage('提交报修失败：' + (error.response?.data?.message || error.message), 'error');
            }
        },
        async updateRepairStatus(repairId, status, reply) {
            try {
                const response = await axios.put(`${this.apiBaseUrl}/repair/${repairId}/status`, {
                    status: status,
                    reply: reply || ''
                });
                if (response.data.code === 200) {
                    this.showMessage('更新成功', 'success');
                    this.showLandlordRepairs();
                }
            } catch (error) {
                this.showMessage('更新失败', 'error');
            }
        },
        getRepairStatusText(status) {
            const statusMap = {
                'PENDING': '待处理',
                'PROCESSING': '处理中',
                'COMPLETED': '已完成',
                'CANCELLED': '已取消'
            };
            return statusMap[status] || status;
        }
    }
}).mount('#app');

