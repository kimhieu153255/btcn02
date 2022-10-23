export default {
  data() {
    return {};
  },
  methods: {
    change() {
      const btn = document.querySelector("#btn").checked;
      document.body.classList.toggle("dark");
    },
  },
  template: `
  <div class="header">
    <div class="studentID">&lt;20120474&gt;</div>
    <div class="header-infor">Movies infor</div>
    <div class="header-wrap">
      <div class="keyAPI">&lt;k_mycikxqhd&gt;</div>
      <div class="wrap-mode">
        <input type="checkbox" id="btn" />
        <label id="label-mode" for="btn" @click="change"></label>
        <div class="background"></div>
        <span>Dark mode</span>
      </div>
    </div>
  </div>
  `,
};
