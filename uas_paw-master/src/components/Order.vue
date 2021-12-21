<template>
<v-main>
    <div>
        <template>
            <div class="d-flex mb-6">
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details dense filled></v-text-field>
                <v-spacer></v-spacer>
                <div class="d-flex justify-end mx-5">
                    <v-btn color="#B71C1C" dark @click="dialog = true">
                        Tambah</v-btn>
                </div>
            </div>
            <v-dialog v-model="dialogEdit" max-width="600" scrollable persistent transition="dialog-bottom-transition">
                <v-card>
                    <v-toolbar color="#B71C1C" dark> {{ formTitle }}</v-toolbar>
                    <v-divider></v-divider>

                    <v-card-text justify="center" style="height: 600px">
                        <v-form ref="form" class="my-6" v-model="valid" lazy-validation>
                        </v-form>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions class="justify-end">
                        <v-btn text @click="(dialogEdit = false), close()">Close </v-btn>
                        <v-btn text @click="setForm()"> Save </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-dialog v-model="dialog" max-width="400px">
                <v-card>
                    <v-card-title>
                        <span class="headline">Tambah</span>
                    </v-card-title>
                    <v-card-text> Ingin tambah transaksi baru? </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="dialog = false">
                            Cancel
                        </v-btn>
                        <v-btn color="blue darken-1" text @click="save()">
                            Tambah
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-dialog v-model="dialogConfirm" max-width="400px">
                <v-card>
                    <v-card-title>
                        <span class="headline">Warning!</span>
                    </v-card-title>
                    <v-card-text> Anda yakin ingin menghapus bahan ini? </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="dialogConfirm = false">
                            Cancel
                        </v-btn>
                        <v-btn color="blue darken-1" text @click="deleteData">
                            Delete
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-data-table :headers="headers" :search="search" :items="pesanans" :loading="load" :items-per-page="10" class="elevation-1">
                <template v-slot:[`item.status`]="{ item }">
                    <div v-if="item.deleted_at == null">Active</div>
                    <div v-else>Banned</div>
                </template>
                <template v-slot:[`item.action`]="{ item }">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn v-bind="attrs" v-on="on" class="mr-2 blue--text" @click="editHandler(item)">
                                <v-icon dark right>
                                    mdi-pencil
                                </v-icon>
                            </v-btn>
                        </template>
                        <span>Edit</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn v-bind="attrs" v-on="on" class="mr-2 red--text" @click="deleteHandler(item)">

                                <v-icon dark right>
                                    mdi-delete
                                </v-icon>
                            </v-btn>
                        </template>
                        <span>Delete</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn v-bind="attrs" v-on="on" class="mr-2 red--text" @click="detailRoute(item)">
                                <v-icon dark right>
                                    mdi-information-outline
                                </v-icon>
                            </v-btn>
                        </template>
                        <span>Detail</span>
                    </v-tooltip>
                </template>
            </v-data-table>
        </template>
        <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
            {{ error_message }}
        </v-snackbar>
    </div>
</v-main>
</template>

<script>
export default {
    data() {
        return {
            search: "",
            snackbar: "",
            error_message: "",
            color: "",
            load: false,
            valid: true,
            dialog: false,
            dialogEdit: false,
            dialogConfirm: false,
            headers: [{
                    text: "No.",
                    value: "id",
                },
                {
                    text: "Invoice",
                    value: "invoice",
                    align: "start"
                },
                {
                    text: "Date",
                    value: "date"
                },
                {
                    text: "Created At",
                    value: "created_at"
                },
                {
                    text: "Updated At",
                    value: "updated_at"
                },
                {
                    text: "Action",
                    value: "action"
                },
            ],
            inputType: "Add",
            pesanan: new FormData(),
            pesanans: [],
            items: [],
            form: {
                nama: null,
                harga: null,
                keterangan: null,
                telp: null,
                password: null,
                select: null,
            },
        };
    },
    methods: {
        close() {
            this.resetForm();
            this.resetValidation();
        },
        mesej(mesej, color) {
            this.error_message = mesej;
            this.color = color;
            this.snackbar = true;
        },
        deleteData() {
            var url = this.$api + "/menu/order/" + this.deleteId;
            //data dihapus berdasarkan id
            this.$http
                .delete(url, {
                    headers: {
                        Authorization: "Bearer " + sessionStorage.getItem("token"),
                    },
                })
                .then((response) => {
                    this.mesej(response.data.message, "green");
                    this.dialogConfirm = false;
                    this.readData(); //mengambil data
                    this.resetForm();
                    this.inputType = "Tambah";
                })
                .catch((error) => {
                    this.mesej(error.response.data.message, "red");
                });
        },
        setForm() {
            if (this.$refs.form.validate()) {
                if (this.inputType === "Add") {
                    this.save();
                } else {
                    this.update();
                }
                this.dialog = false;
                this.resetValidation();
                this.dialogTambah = false;
            } else {
                this.error_message = "Submit Failed";
                this.color = "red";
                this.snackbar = true;
            }
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
                    this.readData(); //mengambil data
                    this.resetForm();
                    this.inputType = "Add";
                })
                .catch((error) => {
                    this.error_message = error;
                    this.color = "red";
                    this.snackbar = true;
                    this.load = false;
                });
        },
        update() {
            let newData = {
                nama: this.form.nama,
                harga: this.form.harga,
                keterangan: this.form.keterangan,
                telp: this.form.telp,
                role_id: this.form.select,
            };
            var url = this.$api + "/order/" + this.editId;
            this.load = true;
            this.put(url, newData);
        },
        validate() {
            this.$refs.form.validate();
        },
        reset() {
            this.$refs.form.reset();
        },
        resetValidation() {
            this.$refs.form.resetValidation();
        },
        detailRoute(item) {
            this.$router.replace({
                name: "Detail Order",
                params: {
                    id: item.id
                },
                query: {
                    q1: "q1"
                }
            })
        },
        readData() {
            this.order();
        },
        deleteHandler(id) {
            this.deleteId = id.id;
            this.dialogConfirm = true;
        },
        save() {
            this.pesanan.append("name", this.form.nama);
            this.pesanan.append("harga", this.form.harga);
            this.pesanan.append("description", this.form.keterangan);
            var url = this.$api + "/menu/order";
            this.load = true;
            this.$http
                .post(url, this.pesanan, {
                    headers: {
                        Authorization: "Bearer " + sessionStorage.getItem("token"),
                    },
                })
                .then((response) => {
                    this.error_message = response.data.message;
                    this.color = "green";
                    this.snackbar = true;
                    this.readData(); //mengambil data
                    this.load = false;
                    this.dialog = false;
                    this.resetForm();
                })
                .catch((error) => {
                    this.error_message = error.response.message;
                    this.color = "red";
                    this.snackbar = true;
                    this.load = false;
                });
        },
        get(url, data) {
            this.$http
                .get(url, {
                    headers: {
                        Authorization: "Bearer " + sessionStorage.getItem("token"),
                    },
                })
                .then((response) => {
                    if (data == "order") {
                        this.pesanans = response.data.data;
                    }
                    this.error_message = "Retrive Data Successful";
                    this.color = "green";
                    this.snackbar = true;
                    this.load = false;
                })
                .catch((error) => {
                    this.error_message = error;
                    console.log(error);
                    this.color = "red";
                    this.snackbar = true;
                });
        },
        order() {
            var url = this.$api + "/menu/order";
            this.get(url, "order");
        },
        editHandler(item) {
            this.inputType = "Edit";
            this.editId = item.id;
            this.form.nama = item.nama;
            this.form.harga = item.harga;
            this.form.keterangan = item.keterangan;
            this.form.telp = item.telp;
            this.form.select = item.role_id;
            console.log(this.editId);
            this.dialogEdit = true;
        },
        resetForm() {
            this.form.nama = null;
            this.form.harga = null;
            this.form.keterangan = null;
            this.form.telp = null;
            this.form.password = null;
            this.form.confirmPass = null;
            this.form.select = null;
            this.inputType = "Add";
        },
    },
    computed: {
        formTitle() {
            return this.inputType;
        },
    },
    mounted() {
        this.readData();
    },
};
</script>
