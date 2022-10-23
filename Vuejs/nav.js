export default {
  data() {
    return {
      str: "",
    };
  },
  methods: {
    backHome() {
      // this.$emit("loadAll");
      this.$emit("back");
    },
    searchName() {
      this.$emit("searchNameMovie", this.str);
    },
  },
  template: `
  <div class="nav">
    <div class="home" @click="backHome">Home</div>
    <div class="btn-search" >
      <input type="text" placeholder="Search" v-model='str'/>
      <button @click='searchName'>Search</button>
    </div>
  </div>
  `,
};
