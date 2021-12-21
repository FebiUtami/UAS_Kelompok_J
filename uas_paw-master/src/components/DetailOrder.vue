<template>
<v-main>
    <div class="d-flex">
        <router-link to="/order">
            <v-btn class="mb-3">
                <v-icon class="mr-3">mdi-keyboard-backspace</v-icon> Back
            </v-btn>
        </router-link>
        <v-spacer></v-spacer>
        <div class="d-flex justify-end align-center">
            <v-btn color="#B71C1C" class="mb-3 white--text mr-3" :disabled="reservasi.status_pembayaran == 'Lunas'" @click="tambahHandler()">
                Tambah / update</v-btn>
            <v-btn color="#B71C1C" class="mb-3 white--text" style="margin-right: -13px" :disabled="reservasi.status_pembayaran == 'Lunas'" @click="dialog = true">
                <v-icon class="mr-3">mdi-credit-card-check</v-icon> Proses Pembayaran
            </v-btn>
        </div>
    </div>
    <v-dialog v-model="dialogTambah" max-width="600" scrollable persistent transition="dialog-bottom-transition">
        <v-card>
            <v-toolbar color="#B71C1C" dark> {{ formTitle }}</v-toolbar>
            <v-divider></v-divider>

            <v-card-text justify="center">
                <v-form ref="form" class="my-6" v-model="valid" lazy-validation>
                    <v-select v-model="form.menu_id" :items="items" item-text="name" item-value="id" label="Select" persistent-hint single-line></v-select>
                    <v-text-field v-model="form.qty" label="Kuantitas" type="number" required></v-text-field>
                </v-form>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions class="justify-end">
                <v-btn text @click="(dialogTambah = false), close()">Close </v-btn>
                <v-btn text @click="setForm()"> Save </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <div>
        <v-row height="100vh" class="d-flex mt-3">
            <v-col cols="12" sm="8">
                <v-row>
                    <v-card width="98%" class="pa-2 " height="382px">
                        <v-card-title>Detail Orders</v-card-title>
                        <v-divider></v-divider>
                        <v-data-table :items-per-page="4" class="mt-1" :loading="load" :headers="headers" :items="details">
                            <template v-slot:[`item.harga`]="{ item }">
                                <div class="d-flex flex-row">
                                    <span>Rp {{ formatPrice(item.harga) }}</span>
                                </div>
                            </template>
                            <template v-slot:[`item.subtotal`]="{ item }">
                                <div class="d-flex flex-row">
                                    <span>Rp {{ formatPrice(item.subtotal) }}</span>
                                </div>
                            </template>
                            <template v-slot:[`item.action`]="{ item }">
                                <v-btn icon class="mr-2 red--text" :disabled="reservasi.status_pembayaran == 'Lunas'" @click="deleteHandler(item)">
                                    <v-icon>
                                        mdi-delete
                                    </v-icon>
                                </v-btn>
                            </template>
                        </v-data-table>
                    </v-card>
                </v-row>
            </v-col>
            <v-col cols="4" md="4" height="600px">
                <v-row>
                    <v-card class="pa-2" width="100%">
                        <div>
                            <v-card-title class="d-flex justify-space-between">
                                Invoice : {{ reservasi.invoice }}
                                <v-chip :ripple="false" small v-if="reservasi.status_pembayaran == 'Lunas'" color="green lighten-4 teal--text">
                                    <div class="d-flex flex-row px-3">
                                        <b class="bold">Lunas</b>
                                    </div>
                                </v-chip>
                                <v-chip :ripple="false" small v-else-if="reservasi.status_pembayaran == 'Belum Lunas'" color="red lighten-4 pink--text">
                                    <div class="d-flex flex-row px-3">
                                        <b class="bold">Belum Lunas</b>
                                    </div>
                                </v-chip>
                            </v-card-title>
                        </div>
                        <v-divider></v-divider>
                        <v-card-text>
                            <table width="100%">
                                <tr>
                                    <th class="d-flex justify-start">Tanggal Pemesanan</th>
                                    <td>:</td>
                                    <td class="d-flex justify-end">
                                        {{ reservasi.date }}
                                    </td>
                                </tr>
                                <tr>
                                    <th class="d-flex justify-start">SubTotal</th>
                                    <td>:</td>
                                    <td class="d-flex justify-end">
                                        Rp {{ formatPrice(hitungSubtotal) }}
                                    </td>
                                </tr>
                                <tr>
                                    <th class="d-flex justify-start">Pajak 10%</th>
                                    <td>:</td>
                                    <td class="d-flex justify-end">
                                        Rp {{ formatPrice(hitungSubtotal * 0.1) }}
                                    </td>
                                </tr>
                                <tr>
                                    <th class="d-flex justify-start">Bayar</th>
                                    <td>:</td>
                                    <td class="d-flex justify-end">
                                        Rp {{ reservasi.payment }}
                                    </td>
                                </tr>
                            </table>
                        </v-card-text>
                    </v-card>
                </v-row>
                <v-row class="mt-4">
                    <v-card class="pa-2" width="100%">
                        <v-card-title class="d-flex">
                            <div class="d-flex justify-start">Total</div>
                            <v-spacer></v-spacer>
                            <div class="d-flex justify-end">
                                Rp {{ formatPrice(hitung_total) }}
                            </div>
                        </v-card-title>
                    </v-card>
                </v-row>

            </v-col>
        </v-row>
    </div>

    <v-dialog v-model="dialog" max-width="600" scrollable persistent transition="dialog-bottom-transition">
        <v-card>
            <v-toolbar color="#B71C1C" dark> Select Payment Method</v-toolbar>

            <v-divider></v-divider>

            <v-tabs v-if="reservasi.status_pembayaran == 'Belum Lunas'" fixed-tabs color="#B71C1C">
                <v-tab @click="jenis_pembayaran = 'Cash'">Cash</v-tab>
                <!-- Cash -->
                <v-tab-item>
                    <v-card-text>
                        <table width="100%">
                            <tr>
                                <th class="d-flex justify-start">Cash</th>
                                <td width="5%" class="d-flex justify-start">:</td>
                                <td>
                                    <v-text-field outlined dense class="ml-4" type="number" v-model="cash"></v-text-field>
                                </td>
                            </tr>
                            <tr>
                                <th class="d-flex justify-start align-center">Kembalian</th>
                                <td class="d-flex justify-start">:</td>
                                <td>
                                    <v-text-field outlined dense class="ml-4" v-model="kembalian" readonly></v-text-field>
                                </td>
                            </tr>
                        </table>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions class="justify-end">
                        <v-btn text @click="(dialog = false), close()">Close </v-btn>
                        <v-btn text @click="saveCash()"> Save </v-btn>
                    </v-card-actions>
                </v-tab-item>
            </v-tabs>
        </v-card>
    </v-dialog>
    <!-- <v-dialog v-model="dialog_cetak" max-width="400px">
        <v-card>
            <v-card-title>
                <span class="headline">Cetak Struk</span>
            </v-card-title>
            <v-card-text> Apakah Anda ingin mencetak struk? </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="dialog_cetak = false">
                    Tidak
                </v-btn>
                <v-btn color="red darken-1" text @click="cetak_struk(), dialog_cetak = false">
                    Ya
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog> -->
    <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
        {{ error_message }}
    </v-snackbar>
</v-main>
</template>

<style scoped>
a {
    text-decoration: none;
}
</style>

<script>
export default {
    data() {
        return {
            id: "",
            dialog: false,
            dialog_cetak: false,
            dialogTambah: false,
            colorGreen: "#26A69A",
            colorRed: "#B71C1C",
            colorGrey: "#607D8B",
            e6: 1,
            date: "",
            error_message: "",
            color: "",
            cash: 0,
            snackbar: false,
            load: false,
            valid: true,
            items: [],
            headers: [{
                    text: "Nama Menu",
                    value: "name",
                },
                {
                    text: "Harga",
                    value: "harga",
                },
                {
                    text: "Kuantitas",
                    value: "qty",
                },
                {
                    text: "Subtotal",
                    value: "subtotal",
                },
                {
                    text: "Action",
                    value: "action"
                },
            ],
            no_detail: "Belum ada pembayaran pada Order ini ",
            details: [],
            reservasi: [],
            type: '',
            pesanan: new FormData(),
            form: {
                menu_id: null,
                qty: null,
            },
        };
    },
    methods: {
        tambahHandler() {
            this.type = "tambah"
            this.menu()
            this.dialogTambah = true
        },
        deleteHandler(id) {
            this.deleteId = id.id;
            this.dialogConfirm = true;
        },
        save() {
            this.pesanan.append("menu_id", this.form.menu_id);
            this.pesanan.append("order_id", this.$router.history.current.params.id);
            this.pesanan.append("qty", this.form.qty);
            var url = this.$api + "/menu/order-detail";
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
                    this.getDetail(); //mengambil data
                    this.load = false;
                    this.dialogTambah = false;
                    this.resetForm();
                })
                .catch((error) => {
                    this.error_message = error.response.message;
                    this.color = "red";
                    this.snackbar = true;
                    this.load = false;
                });
        },
        setForm() {
            (this.type = 'tambah') ?
            this.save(): this.update()
            this.dialog = false;
            this.dialogTambah = false;
        },
        saveCash() {
            if (this.cash < this.hitung_total) {
                this.error_message = "Cash tidak cukup";
                this.color = "red";
                this.snackbar = true;
            } else {
                let data = {
                    payment: this.cash,
                    change: this.cash - this.hitung_total,
                };
                console.log(data);
                var url = this.$api + "/menu/order/" + this.$router.history.current.params.id;
                this.put(url, data)
            }
        },
        getDetail() {
            var url =
                this.$api + "/menu/order-detail?order_id=" + this.$router.history.current.params.id;
            this.get(url, "detail");
        },
        getHeader() {
            var url = this.$api + "/menu/order/" + this.$router.history.current.params.id;
            this.get(url, "header");
        },
        formatPrice(value) {
            let val = (value / 1).toFixed(2).replace(".", ",");
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        },
        menu() {
            var url = this.$api + "/menu/menu";
            this.get(url, "menu");
        },
        get(url, data) {
            this.$http
                .get(url, {
                    headers: {
                        Authorization: "Bearer " + sessionStorage.getItem("token"),
                    },
                })
                .then((response) => {
                    if (data == "detail") {
                        this.details = response.data.data;
                        console.log(this.details)
                        this.customer = response.data.customer;
                        this.card = response.data.card;
                        console.log(this.customer)
                        this.mejas = response.data.meja;
                        this.getHeader();
                        this.load = false;
                    }
                    if (data == "header") {
                        this.reservasi = response.data.data;
                    }
                    if (data == "menu") {
                        this.items = response.data.data;
                    }

                })
                .catch((error) => {
                    this.error_message = error.data;
                    console.log(error);
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
                    this.dialog = false;
                    this.dialog_cetak = true;
                    this.getDetail();
                })
                .catch((error) => {
                    this.error_message = error;
                    this.color = "red";
                    this.snackbar = true;
                    this.load = false;
                });
        },
    },
    computed: {
        hitungSubtotal() {
            let Total = 0;
            for (let i = 0; i < this.details.length; i++) {
                Total += this.details[i].subtotal;
            }
            return Total;
        },
        hitung_total() {
            return (
                this.hitungSubtotal +
                this.hitungSubtotal * 0.1
            );
        },
        kembalian() {
            return "Rp " + this.formatPrice(this.cash - this.hitung_total);
        },
        hitung_totalqty() {
            let Total = 0;
            for (let i = 0; i < this.details.length; i++) {
                Total += this.details[i].kuantitas;
            }
            return Total;
        },
    },
    mounted() {
        this.getDetail();
    },
};
</script>
