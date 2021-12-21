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
            <v-dialog v-model="dialog" max-width="600" scrollable persistent transition="dialog-bottom-transition">
                <v-card>
                    <v-toolbar color="#B71C1C" dark> {{ formTitle }}</v-toolbar>
                    <v-divider></v-divider>

                    <v-card-text justify="center" style="height: 600px">
                        <v-form ref="form" class="my-6" v-model="valid" lazy-validation>
                            <v-text-field v-model="form.nama" :counter="50" label="Name" required></v-text-field>

                            <v-text-field v-model="form.harga" label="Harga" type="number" required></v-text-field>

                            <v-textarea name="input-7-1" v-model="form.keterangan" label="Keterangan" hint="Hint text"></v-textarea>
                        </v-form>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions class="justify-end">
                        <v-btn text @click="(dialog = false), close()">Close </v-btn>
                        <v-btn text @click="setForm()"> Save </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-data-table :headers="headers" :search="search" :items="employees" :loading="load" :items-per-page="10" class="elevation-1">
                <template v-slot:[`item.status`]="{ item }">
                    <div v-if="item.deleted_at == null">Active</div>
                    <div v-else>Banned</div>
                </template>
                <template v-slot:[`item.action`]="{ item }">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn v-bind="attrs" v-on="on" class="mr-2  blue--text" @click="editHandler(item)">EDIT
                                <v-icon dark right>

                                    mdi-pencil
                                </v-icon>
                            </v-btn>
                        </template>
                        <span>Edit</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn v-bind="attrs" v-on="on" class="mr-2  red--text" @click="deleteHandler(item)">
                                DELETE
                                <v-icon dark right>
                                    mdi-delete
                                </v-icon>
                            </v-btn>
                        </template>
                        <span>Ban Account</span>
                    </v-tooltip>
                </template>
            </v-data-table>
            <v-dialog v-model="dialogConfirm" max-width="400px">
                <v-card>
                    <v-card-title>
                        <span class="headline">warning!</span>
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
            deletedId: "",
            valid: true,
            dialogConfirm: false,
            name: "",
            nameRules: [(v) => !!v || "Name is required"],
            keterangan: "",
            keteranganRules: [
                (v) => !!v || "E-mail is required",
                (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
            ],
            address: "",
            addressRules: [(v) => !!v || "Address is required"],
            telp: "",
            telpRules: [(v) => !!v || "Telp is required"],
            password: "",
            passwordRules: [(v) => !!v || "Password is required"],
            confirmPass: "",
            confirmRules: [
                (v) => !!v || "Confirm password is required",
                (v) => v == this.form.password || "Password is not match",
            ],

            roleRules: [(v) => !!v || "Role is required"],
            select: null,
            checkbox: false,
            dialog: false,
            notifications: false,
            sound: true,
            load: true,
            widgets: false,
            headers: [{
                    text: "No.",
                    value: "id",
                },
                {
                    text: "Nama",
                    value: "name",
                    align: "start"
                },
                {
                    text: "Harga",
                    value: "harga"
                },
                {
                    text: "Keterangan",
                    value: "description"
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
            employee: new FormData(),
            employees: [],
            roles: ["Owner", "Operational Manager", "Cashier", "Waiter", "Chef"],
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
            var url = this.$api + "/menu/" + this.editId;
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
        readData() {
            this.menu();
        },
        save() {
            this.employee.append("name", this.form.nama);
            this.employee.append("harga", this.form.harga);
            this.employee.append("description", this.form.keterangan);
            var url = this.$api + "/menu/menu";
            this.load = true;
            this.$http
                .post(url, this.employee, {
                    headers: {
                        Authorization: "Bearer " + sessionStorage.getItem("token"),
                    },
                })
                .then((response) => {
                    this.error_message = response.data.message;
                    this.color = "green";
                    this.snackbar = true;
                    this.load = false;
                    this.close();
                    this.readData(); //mengambil data
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
                    if (data == "menu") {
                        this.employees = response.data.data;
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
        menu() {
            var url = this.$api + "/menu/menu";
            this.get(url, "menu");
        },
        deleteData() {
            var url = this.$api + "/menu/menu/" + this.deleteId;
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
        mesej(mesej, color) {
            this.error_message = mesej;
            this.color = color;
            this.snackbar = true;
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
            this.dialog = true;
        },
        deleteHandler(id) {
            this.deleteId = id.id;
            this.dialogConfirm = true;
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
