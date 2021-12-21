<template>
<v-main>
    <v-container>
        <v-card-actions>
            <v-row>
                <v-col sm="12" md="3">
                    <v-avatar slot="offset" class="mx-auto d-block" size="150">
                        <img contain :src="avatar" alt="Avatar">
                    </v-avatar>
                    <v-card-text>
                        <div class="text-center">
                            <h2 class="font-weight-regular mb-4">{{user.name}}</h2>
                            <v-btn color="primary" class="text-none" round depressed :loading="isSelecting" @click="onButtonClick">
                                <v-icon left>
                                    mdi-cloud-upload
                                </v-icon>
                                {{ buttonText }}
                            </v-btn>
                            <input ref="uploader" class="d-none" type="file" accept="image/*" @change="onFileChanged">
                        </div>
                    </v-card-text>
                </v-col>

                <v-col sm="12" md="8">
                    <v-form ref="form" lazy-validation>
                        <v-card>
                            <v-container>
                                <v-row>
                                    <v-col sm="12" md="4">
                                        <v-text-field v-model="user.name" :disabled="!isEditing" :rules="[v => !!v || 'Item is required']" label="Name" required></v-text-field>
                                    </v-col>
                                    <v-col sm="12" md="8">
                                        <v-text-field v-model="user.email" :disabled="!isEditing" :rules="[v => !!v || 'Item is required']" label="E-mail" required></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col sm="12" md="4">
                                        <v-text-field v-model="user.phone" :disabled="!isEditing" :rules="[v => !!v || 'Item is required']" type="number" label="Phone" required></v-text-field>
                                    </v-col>
                                    <v-col sm="12" md="8">
                                        <v-text-field v-model="user.address" :disabled="!isEditing" :rules="[v => !!v || 'Item is required']" label="Address" required></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col sm="12" md="4">
                                        <v-text-field v-model="user.suite" :disabled="!isEditing" :rules="[v => !!v || 'Item is required']" label="Suite" required></v-text-field>
                                    </v-col>
                                    <v-col sm="12" md="4">
                                        <v-text-field v-model="user.city" :disabled="!isEditing" :rules="[v => !!v || 'Item is required']" label="City" required></v-text-field>
                                    </v-col>
                                    <v-col sm="12" md="4">
                                        <v-text-field v-model="user.zipcode" :disabled="!isEditing" :rules="[v => !!v || 'Item is required']" type="number" label="Zipcode" required></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-card-actions class="justify-end">
                                    <v-btn v-if="isEditing" @click="cancel">Cancel</v-btn>
                                    <v-btn :color="!isEditing ? 'primary' : 'success'" @click="edit">{{btnText}}</v-btn>
                                </v-card-actions>
                            </v-container>
                        </v-card>
                    </v-form>
                </v-col>

            </v-row>
        </v-card-actions>
    </v-container>
    <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
        {{ error_message }}
    </v-snackbar>
</v-main>
</template>

<script>
// import AvatarPicker from '~/components/AvatarPicker'
export default {
    pageTitle: 'My Profile',
    components: {},
    data() {
        return {
            colorGreen: "#26A69A",
            colorRed: "#B71C1C",
            colorGrey: "#607D8B",
            e6: 1,
            date: "",
            error_message: "",
            color: "",
            loading: false,
            isEditing: false,
            snackbar: false,
            user: {},
            defaultButtonText: 'Upload Image',
            selectedFile: null,
            pesanan: new FormData(),
            isSelecting: false,
            avatar: "https://www.gravatar.com/avatar/94d093eda664addd6e450d7e9881bcad?s=150&d=identicon&r=PG",
        }
    },
    created() {
        this.get(this.$api + "/menu/users/" + sessionStorage.getItem("id"));
    },

    computed: {
        btnText() {
            return this.isEditing ? "Save" : "Edit";
        },
        buttonText() {
            return this.selectedFile ? this.selectedFile.name : this.defaultButtonText
        }
    },

    methods: {
        onButtonClick() {
            if (this.selectedFile) {
                console.log(this.selectedFile == null)
                this.post(this.$api + "/menu/users/" + sessionStorage.getItem("id"))
            } else {
                this.isSelecting = true
                window.addEventListener('focus', () => {
                    this.isSelecting = false
                }, {
                    once: true
                })

                this.$refs.uploader.click()
            }
        },
        onFileChanged(e) {
            this.selectedFile = e.target.files[0]
            this.avatar = URL.createObjectURL(this.selectedFile);

            // do something
        },
        post(url) {
            this.pesanan.append("image", this.selectedFile);
            this.$http
                .post(url, this.pesanan, {
                    headers: {
                        Authorization: "Bearer " + sessionStorage.getItem("token"),
                    },
                })
                .then((response) => {
                    this.error_message = response.data.message;
                    console.log(this.error_message)
                    this.color = "green";
                    this.snackbar = true;
                    this.get(this.$api + "/menu/users/" + sessionStorage.getItem("id")); //mengambil data
                    this.load = false;
                    this.dialogTambah = false;
                })
                .catch((error) => {
                    this.error_message = error;
                    this.color = "red";
                    this.snackbar = true;
                    this.load = false;
                });
        },
        get(url) {
            this.$http
                .get(url, {
                    headers: {
                        Authorization: "Bearer " + sessionStorage.getItem("token"),
                    },
                })
                .then((response) => {
                    this.user = response.data.data;
                    if (this.user.photo)
                        this.avatar = this.$baseURL + '/images/' + this.user.photo

                    this.load = false;
                })
                .catch((error) => {
                    this.error_message = error.data;
                    this.color = "red";
                    this.snackbar = true;
                });
        },

        put(url, newData) {
            this.$http
                .put(url, newData, {
                    headers: {
                        Authorization: "Bearer " + sessionStorage.getItem("token"),
                    },
                })
                .then((response) => {
                    this.error_message = response.data.message;
                    this.color = "green";
                    this.snackbar = true;
                    this.load = false;
                    this.getDetail();
                })
                .catch((error) => {
                    this.error_message = error;
                    this.color = "red";
                    this.snackbar = true;
                    this.load = false;
                });
        },

        cancel() {
            this.isEditing = false;
            this.user = Object.assign({}, this.initUser);
            this.address = Object.assign({}, this.initAddress);
        },
        edit() {
            if (!this.isEditing) {
                this.isEditing = true;
            } else if (this.$refs.form.validate()) {
                this.put(this.$api + "/menu/users/" + sessionStorage.getItem("id"), this.user)
                this.isEditing = false;
                this.initUser = Object.assign({}, this.user);
                this.initAddress = Object.assign({}, this.address);
            }
        },
    }
}
</script>
