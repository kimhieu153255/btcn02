import Header from "./header.js";
import Nav from "./nav.js";
import Footer from "./footer.js";
import data from "./data.js";
import store from "./store.js";

export default {
  data() {
    return {
      store,
      isDisplay: false,
      icard: false,
      iload: true,
      isearch: false,
      data: "",
    };
  },
  methods: {
    async getData() {
      const path = "https://imdb-api.com/en/API/MostPopularMovies/k_mycikxqh";
      const message = await fetch(path);
      const cons = await message.json();
      store.datas = cons.items.map((obj) => new data(obj));
      const t = await fetch(
        "https://imdb-api.com/en/API/InTheaters/k_mycikxqh"
      );
      const d = await t.json();
      store.datas.forEach((el0) => {
        d.items.forEach((el) => {
          if (el.id === el0.id) {
            el0.year = el.releaseState;
            el0.author = el.directors;
            el0.gen = el.genres;
            el0.des = el.plot;
            el0.star = el.stars;
            el0.leng = el.runtimeStr;
          }
        });
      });
      store.popularMovies = this.get(true);
      store.topRateMovies = this.get();
      store.newMovies = this.get5();
    },

    //get popular or rate movie
    get(isRate = false) {
      let arr = [];
      if (isRate) {
        for (let i = 0; i < 15; i++) {
          arr.push(store.datas[i]);
        }
      } else {
        let temp = store.datas.sort((a, b) => {
          let da = parseFloat(a.rating),
            db = parseFloat(b.rating);
          return db - da;
        });
        for (let i = 0; i < 15; i++) {
          arr.push(temp[i]);
        }
      }
      return arr;
    },
    //get top 5
    get5() {
      let arr = [];
      let temp = store.datas.sort((a, b) => {
        let da = new Date(a.year),
          db = new Date(b.year);
        return db - da;
      });
      for (let i = 0; i < 5; i++) {
        arr.push(temp[i]);
      }
      return arr;
    },
    //load 1 movie in top 5
    loadNew(page = 1) {
      const avatar = document.querySelector(".img");
      avatar.src = store.newMovies[page - 1].img;
      const nameMovie = document.querySelector(".name-movie");
      nameMovie.innerHTML = store.newMovies[page - 1].title;
      this.checked(page, ".active");
    },
    checked(page, str) {
      const list = document.querySelectorAll(str);
      list.forEach((el) => {
        el.classList.remove("act");
      });
      list[page - 1].classList.add("act");
    },
    leftBtn() {
      if (store.iNew > 1) {
        this.loadNew(store.iNew - 1);
        store.iNew--;
      }
    },
    rightBtn() {
      if (store.iNew < 5) {
        this.loadNew(store.iNew + 1);
        store.iNew++;
      }
    },
    //loadpopular or rate
    load15(is = true, page = 1) {
      let list, arr, title;
      if (is) {
        arr = store.popularMovies;
        list = document.querySelectorAll(".img1");
        title = document.querySelectorAll(".title1");
        this.checked(page, ".active1");
      } else {
        arr = store.topRateMovies;
        list = document.querySelectorAll(".img2");
        title = document.querySelectorAll(".title2");
        this.checked(page, ".active2");
      }
      let i = 0;
      for (let i = 0; i < list.length; i++) {
        list[i].src = arr[3 * (page - 1) + i].img;
        title[i].textContent = arr[3 * (page - 1) + i].title;
      }
    },
    left(i, is = true) {
      if (i > 1) {
        this.load15(is, i - 1);
        if (is) store.iPopular--;
        else store.iRate--;
      }
    },
    right(i, is = true) {
      if (i < 5) {
        this.load15(is, i + 1);
        if (is) store.iPopular++;
        else store.iRate++;
      }
    },
    async loadAll() {
      this.isDisplay = true;
      this.icard = false;
      this.iload = false;
      const a = document.querySelector(".loadpage");
      a.classList.add("non");
      await this.getData();
      this.loadNew(store.iNew);
      this.load15(true, store.iPopular);
      this.load15(false, store.iRate);
    },
    getCard(a, ind) {
      this.iload = false;
      this.isDisplay = false;
      this.icard = true;
      if (a == 1) {
        this.data = store.newMovies[store.iNew - 1 + ind];
      } else if (a == 2) {
        this.data = store.popularMovies[(store.iPopular - 1) * 3 + ind];
      } else this.data = store.topRateMovies[(store.iRate - 1) * 3 + ind];
    },
    getInfor(data) {
      this.iload = false;
      this.isDisplay = false;
      this.isearch = false;
      this.icard = true;
      this.data = data;
    },
    back() {
      this.icard = false;
      this.isDisplay = true;
      this.isearch = false;
      store.iNew = 1;
      store.iPopular = 1;
      store.iRate = 1;
    },
    async searchNameMovie(name) {
      this.isearch = true;
      this.icard = false;
      this.isDisplay = false;
      let arr = [];
      store.datas.forEach((el) => {
        if (el.title.toLowerCase().includes(name.toLowerCase())) {
          arr.push(el);
        } else if (el.star.toLowerCase().includes(name.toLowerCase())) {
          arr.push(el);
        }
      });
      this.arrSearch = arr;
    },
  },
  components: {
    Header,
    Nav,
    Footer,
  },
  template: `
  <Header />
  <Nav @back='back' @searchNameMovie='searchNameMovie'/>
  <button class='loadpage' @click="loadAll" v-if='this.iload'>Load</button>
  <div class="main-screen" >
    <div className="wrap" v-if='this.isDisplay'>
      <div class="new-movies"  >
        <div class="cardTop card">
          <img class="img" :src="store.newMovies[0].img" @click='getCard(1,0)' />
          <span class="name-movie">{{store.newMovies[0].title}}</span>
          <ul class='btn-change' >
          <li class="active" @click="loadNew(1),store.iNew=1"></li>
          <li class="active" @click="loadNew(2),store.iNew=2"></li>
          <li class="active" @click="loadNew(3),store.iNew=3"></li>
          <li class="active" @click="loadNew(4),store.iNew=4"></li>
          <li class="active" @click="loadNew(5),store.iNew=5"></li>
          </ul>
        </div>
        <span class='left-btn' @click='leftBtn'>&lt;</span>
        <span class='right-btn' @click='rightBtn'>&gt;</span>
      </div>
      <div class='name'>Most popular</div>
      <div class="most-popular">
        <ul class='btn-change'>
          <li class="active1" @click="load15(true,1),store.iPopular=1"></li>
          <li class="active1" @click="load15(true,2),store.iPopular=2"></li>
          <li class="active1" @click="load15(true,3),store.iPopular=3"></li>
          <li class="active1" @click="load15(true,4),store.iPopular=4"></li>
          <li class="active1" @click="load15(true,5),store.iPopular=5"></li>
        </ul>
        <div className="cardPopular card" @click='getCard(2,0)'>
          <img class='img1' :src="this.store.popularMovies[0].img"  />
          <div class="title1">{{this.store.popularMovies[0].title}}</div>
        </div>
        <div className="cardPopular card" @click='getCard(2,1)'>
          <img class='img1' :src="this.store.popularMovies[1].img"  />
          <div class="title1">{{this.store.popularMovies[1].title}}</div>
        </div>
        <div className="cardPopular card" @click='getCard(2,2)'>
          <img class='img1' :src="this.store.popularMovies[2].img"  />
          <div class="title1">{{this.store.popularMovies[2].title}}</div>
        </div>
        <span class='left-btn-popular' @click='left(store.iPopular,true)'>&lt;</span>
        <span class='right-btn-popular' @click='right(store.iPopular,true)'>&gt;</span>
      </div>
      <div class='name'>Top rating</div>
      <div class="top-rating">
        <ul class='btn-change'  >
            <li class="active2" @click="load15(false,1),store.iRate=1"></li>
            <li class="active2" @click="load15(false,2),store.iRate=2"></li>
            <li class="active2" @click="load15(false,3),store.iRate=3"></li>
            <li class="active2" @click="load15(false,4),store.iRate=4"></li>
            <li class="active2" @click="load15(false,5),store.iRate=5"></li>
        </ul>
        <div className="cardRate card" @click='getCard(3,0)'>
          <img class='img2' :src="this.store.topRateMovies[0].img"  />
          <div class="title2">{{this.store.topRateMovies[0].title}}</div>
        </div>
        <div className="cardRate card" @click='getCard(3,1)'>
          <img class='img2' :src="this.store.topRateMovies[1].img" />
          <div class="title2">{{this.store.topRateMovies[1].title}}</div>
        </div>
        <div className="cardRate card" @click='getCard(3,2)'>
          <img class='img2' :src="this.store.topRateMovies[2].img"  />
          <div class="title2">{{this.store.topRateMovies[2].title}}</div>
        </div>
        <span class='left-btn-rate' @click='left(store.iRate,false)'>&lt;</span>
        <span class='right-btn-rate' @click='right(store.iRate,false)'>&gt;</span></div>
      </div>
    </div>
    <div class="iscreen" v-else>
      <div class="tempCard" v-if='this.icard'>
        <img class="imgload" :src="this.data.img" />
        <span class="name-movie">{{this.data.title}}</span>
        <span>Launch: {{this.data.year}}</span>
        <span>Type: {{this.data.gen}}</span>
        <span>Description: {{this.data.leng}}</span>
        <span>Author: {{this.data.author}}</span>
        <span>Stars: {{this.data.star}}</span>
        <span>Description: {{this.data.des}}</span>
      </div>
      <div class="searchpage" v-if='this.isearch' >
        <div class="cardSearch" v-for='data in arrSearch' @click='getInfor(data)'>
          <img class="imgload" :src="data.img" />
          <span class="name-movie">{{data.title}}</span>
          <span class='launch-movie'>{{data.year}}</span>
        </div>
      </div>
    </div>
  </div>
  <Footer/>
  `,
};
