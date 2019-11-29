<template>
  <div class="container" id="app">
    <div class="d-flex flex-row">
      <div
        class="d-flex left-bar justify-content-center align-items-center"
        v-bind:class="{'left-bar-angle' : !show}"
      >
        <!--MAIN LIFT LOGO-->
        <h1>
          <a class="d-flex logo align-items-center" href="#">
            <i class="d-flex fas fa-dot-circle logo-icon"></i>
            <p class="d-flex logo-text">To Do</p>
          </a>
        </h1>
      </div>
      <div class="d-flex mr-auto p-2 bd-highlight align-items-center">
        <i
          @click="onClick"
          class="far fa-arrow-alt-circle-left hide-sidebar"
          v-bind:class="{ 'rotate' : show}"
        ></i>
      </div>
      <!--MODAL FOR ADD TASK-->
      <div
        class="modal fade"
        id="addModal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="addModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h3 class="modal-title" id="addModalLabel">Add task in To Do list</h3>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body d-flex flex-column">
              <h5 class="modal-title">Task name:</h5>
              <input
                class="form-text"
                placeholder="New task"
                type="text"
                v-model="newTask.title"
                maxlength="40"
              />
              <hr />
              <h5 class="modal-title">Select task priority:</h5>
              <div class="btn-group">
                <button
                  type="button"
                  class="btn btn-danger dropleft"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >{{ newTask.priority }}</button>
                <div class="dropdown-menu">
                  <a class="dropdown-item" @click="selectPriority('Hight Priority')" href="#">
                    Hight
                    Priority
                  </a>
                  <a class="dropdown-item" @click="selectPriority('Medium Priority')" href="#">
                    Medium
                    Priority
                  </a>
                  <a class="dropdown-item" @click="selectPriority('Low Priority')" href="#">
                    Low
                    Priority
                  </a>
                </div>
              </div>
              <hr />
              <h5 class="modal-title">Task description:</h5>
              <textarea
                class="form-group"
                placeholder="Description..."
                type="text"
                v-model="newTask.desc"
                maxlength="220"
                wrap="hard"
              ></textarea>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" class="btn btn-success" @click="addTask">Add</button>
            </div>
          </div>
        </div>
      </div>
      <!--END MODAL ADD-->
      <!--SELECT PRIORITY BUTTON-->
      <div class="d-flex p-2 align-items-center">
        <div class="btn-group">
          <button
            type="button"
            class="btn btn-dark btn-select-prior-angle"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >{{ priorityFilter }}</button>
          <button
            type="button"
            class="btn-outline-dark btn-cancel-priority"
            @click="priorityFilter = 'Select priority'"
          >
            <i class="fas fa-times cancel-hover"></i>
          </button>
          <div class="dropdown-menu dropdown-menu-priority">
            <label>
              <input type="radio" v-model="priorityFilter" value="Hight Priority" /> Hight Priority
            </label>
            <label>
              <input type="radio" v-model="priorityFilter" value="Medium Priority" /> Medium Priority
            </label>
            <label>
              <input type="radio" v-model="priorityFilter" value="Low Priority" /> Low Priority
            </label>
          </div>
        </div>
      </div>
      <!--END SELECT PRIORITY BUTTON-->
      <!--SORT BUTTON-->
      <div class="d-flex p-2 align-items-center">
        <a @click="sortTasks()">
          <i
            class="but-sort"
            v-bind:class="{'fas fa-sort-numeric-down' : !sortDirection, 'fas fa-sort-numeric-up' : sortDirection }"
          ></i>
        </a>
      </div>
      <!--END SORT BUTTON-->
      <!--ADD TASK BUTTON. CALL ADD MODAL-->
      <div class="d-flex p-2 align-items-center">
        <button
          type="button"
          class="btn btn-primary btn-add-to-do-angle"
          data-toggle="modal"
          data-target="#addModal"
        >+ Add To Do</button>
      </div>
      <!--END ADD TASK BUTTON-->
      <!--USER ICON. IN THIS VERSION LOGIN/REGISTRATION IS NOT INCLUDED...COMING SOON:)-->
      <div class="d-flex p-2 align-items-center">
        <i class="fas fa-user-tie icon-user-right"></i>
      </div>
    </div>
    <!--HIDE SIDEBAR-->
    <div class="d-flex flex-row justify-content-between"></div>
    <!--LEFT SIDEBAR-->
    <div class="d-flex flex-row layout">
      <transition name="slide-fade">
        <aside class="left-bar-button" v-show="show">
          <a class="d-flex flex-row left-button" href="#">
            <div class="left-tab"></div>

            <i class="fas fa-home left-button-icon"></i>
            <p class="left-button-text">Home</p>
          </a>

          <a class="d-flex flex-row left-button" href="#">
            <div class="left-tab"></div>
            <i class="fas fa-cog left-button-icon"></i>
            <p class="left-button-text">Settings</p>
          </a>
        </aside>
      </transition>
      <!--PLACEMENT BUTTONS AND TODO.LENGTH-->
      <div class="task-container" v-bind:class="{'expand-container' : !show}">
        <div class="d-flex flex-row bd-highlight align-items-center">
          <h3 class="mr-auto p-2 bd-highlight list-title">{{"To Do: ("+ tasks.length+")"}}</h3>
          <!--TILE LIST-->
          <a class="p-2 bd-highlight group-list" @click="placement = true">
            <i class="fas fa-th"></i>
          </a>
          <!--ROW LIST-->
          <a class="p-2 bd-highlight group-list" @click="placement = false">
            <i class="fas fa-align-justify"></i>
          </a>
        </div>

        <!--TASK LIST----------------------------------------------------------------------------->
        <div v-bind:class="{ placeTile: placement }">
          <draggable v-bind:class="{ placeTile : placement}" :list="displayTasks" group="people">
            <div
              class="task-block content d-flex align-items-center"
              v-bind:class="{ 'tile-task-block': placement ,'task-priority-color-back-h': task.priority == 'Hight Priority',
                      'task-priority-color-back-l': task.priority == 'Low Priority',
                      'task-priority-color-back-m': task.priority == 'Medium Priority'}"
              v-for="(task, index) of displayTasks"
              ondragstart="drag(event)"
              :key="task.id"
            >
              <!--START EDIT MODAL-->
              <div
                class="modal fade"
                id="editModal"
                tabindex="-1"
                role="dialog"
                aria-labelledby="editModalLabel"
                aria-hidden="true"
              >
                <div class="modal-dialog" role="document">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h3 class="modal-title" id="editModalLabel">Edit task</h3>
                      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div class="modal-body d-flex flex-column">
                      <h5 class="modal-title">Current name - {{ task.title }}:</h5>
                      <input
                        class="form-text"
                        placeholder="New task name"
                        type="text"
                        v-model="editTask.title"
                        maxlength="40"
                      />
                      <hr />
                      <h5 class="modal-title">Current task priority - {{ task.priority }}:</h5>
                      <div class="btn-group">
                        <button
                          type="button"
                          class="btn btn-danger dropleft"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >{{ editTask.priority }}</button>
                        <div class="dropdown-menu">
                          <a
                            class="dropdown-item"
                            @click="editTask.priority = 'Hight Priority'"
                            href="#"
                          >Hight Priority</a>
                          <a
                            class="dropdown-item"
                            @click="editTask.priority = 'Medium Priority'"
                            href="#"
                          >Medium Priority</a>
                          <a
                            class="dropdown-item"
                            @click="editTask.priority = 'Low Priority'"
                            href="#"
                          >Low Priority</a>
                        </div>
                      </div>
                      <hr />
                      <h5 class="modal-title">Task description:</h5>
                      <textarea
                        class="form-group"
                        placeholder="Description..."
                        type="text"
                        v-model="editTask.desc"
                        maxlength="220"
                      ></textarea>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                      <button type="button" class="btn btn-success" @click="saveTask(index)">Save</button>
                    </div>
                  </div>
                </div>
              </div>
              <!--END EDIT MODAL-->
              <div class="d-flex justify-content-between task-container">
                <div class="task-logo" v-bind:class="{ hide: placement }">
                  <p>{{ firstLetter(index) }}</p>
                </div>

                <div class="d-flex flex-column task-center-blk">
                  <div
                    class="d-flex justify-content-between title-container align-items-center"
                    v-bind:class="{ 'flex-row': !placement, 'flex-column': placement}"
                  >
                    <p class="mr-auto task-title">{{ task.title }}</p>

                    <p
                      class="task-priority"
                      v-bind:class="{ 'fas fa-long-arrow-alt-up task-priority-color-h': task.priority == 'Hight Priority',
                      'fas fa-long-arrow-alt-down task-priority-color-l': task.priority == 'Low Priority',
                      'fas fa-arrows-alt-v task-priority-color-m': task.priority == 'Medium Priority'}"
                    >{{ task.priority }}</p>

                    <p
                      class="task-date d-flex far fa-clock task-date"
                      v-bind:class="{ hide: placement }"
                    >{{ task.createDate | dataFilter}}</p>
                  </div>

                  <div class="task-description">
                    <p v-bind:class="{ hide: placement }">{{ task.desc }}</p>
                  </div>
                </div>

                <div class="d-flex btn-group dropleft align-self-center">
                  <a
                    class="task-dropdown"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <i class="fas fa-ellipsis-v"></i>
                  </a>

                  <div class="dropdown-menu">
                    <a class="dropdown-item btn-success" @click="complete(task)" href="#">Complete</a>
                    <a
                      class="dropdown-item btn-success"
                      data-toggle="modal"
                      data-target="#editModal"
                      @click="setEditIndex(index)"
                    >Edit</a>
                    <div class="dropdown-divider"></div>
                    <a
                      class="dropdown-item btn-danger"
                      @click="removeTask(task)"
                      href="#"
                    >Delete Task</a>
                  </div>
                </div>
              </div>
            </div>
          </draggable>
        </div>
        <!--END TASKS LIST-->
        <!--COMPLETED TASKS LIST-->
        <h3 class="list-title">{{"Completed: ("+ solvedTasks.length+")"}}</h3>

        <div v-bind:class="{ placeTile: placement }">
          <draggable v-bind:class="{ placeTile : placement}" :list="solvedTasks" group="people">
            <div
              class="task-block content d-flex align-items-center"
              v-bind:class="{ 'tile-task-block': placement ,'task-priority-color-back-h': solvedTask.priority == 'Hight Priority',
                      'task-priority-color-back-l': solvedTask.priority == 'Low Priority',
                      'task-priority-color-back-m': solvedTask.priority == 'Medium Priority'}"
              v-for="(solvedTask, index) of solvedTasks"
              :key="solvedTask.id"
            >
              <div class="d-flex justify-content-between task-container align-items-center">
                <div class="task-logo" v-bind:class="{ hide: placement }">
                  <p>{{ firstLetterSolved(index) }}</p>
                </div>

                <div class="d-flex flex-column task-center-blk">
                  <div
                    class="d-flex title-container"
                    v-bind:class="{ 'flex-row': !placement, 'flex-column': placement}"
                  >
                    <p class="task-title">{{ solvedTask.title }}</p>

                    <div class="ml-auto d-flex completed align-items-center">
                      <i class="far fa-check-circle" v-bind:class="{ hide: placement }"></i>
                      <p class="completed-text" v-bind:class="{ hide: placement }">Completed</p>
                    </div>
                  </div>

                  <div class="task-description">
                    <p v-bind:class="{ hide: placement }">{{ solvedTask.desc }}</p>
                  </div>
                </div>
                <div class="d-flex btn-group dropleft align-self-center">
                  <a
                    class="task-dropdown"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <i class="fas fa-ellipsis-v"></i>
                  </a>

                  <div class="dropdown-menu">
                    <a
                      class="dropdown-item btn-primaru"
                      @click="returnInToDo(solvedTask)"
                      href="#"
                    >Return in To Do</a>
                    <div class="dropdown-divider"></div>
                    <a
                      class="dropdown-item btn-danger"
                      @click="removeSolvedTask(solvedTask)"
                      href="#"
                    >Delete Task</a>
                  </div>
                </div>
              </div>
            </div>
          </draggable>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line
/* eslint-disable */
import draggable from "vuedraggable";
import VueMomentLib from "vue-moment-lib";
Vue.use(VueMomentLib);
var moment = require("moment");
export default {
  name: "app",
  data() {
    return {
      id: 6,
      show: true,
      date: "date",
      editIndex: 0,
      sortDirection: true,
      priorityFilter: "Select priority",
      search: "",
      newUser: {
        name: "",
        email: ""
      },
      placement: false,
      newTask: {
        title: "",
        desc: "",
        priority: "Hight Priority",
        createDate: new Date(),
        id: this.id
      },
      editTask: {
        title: "",
        desc: "",
        priority: "Hight Priority",
        createDate: new Date(),
        id: this.id
      },
      tasks: [
        {
          title: "Lorem ipsum-1",
          desc:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum. ",
          priority: "Hight Priority",
          createDate: new Date(),
          id: 0
        },
        {
          title: "Lorem ipsum-2",
          desc:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum. ",
          priority: "Low Priority",
          createDate: new Date(),
          id: 1
        },
        {
          title: "Lorem ipsum-3",
          desc:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum. ",
          priority: "Medium Priority",
          createDate: new Date(),
          id: 2
        }
      ],
      solvedTasks: [
        {
          title: "Lorem ipsum-4",
          desc:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum. ",
          priority: "Medium Priority",
          createDate: new Date(),
          id: 3
        },
        {
          title: "Lorem ipsum-5",
          desc:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum. ",
          priority: "Low Priority",
          createDate: new Date(),
          id: 4
        },
        {
          title: "Lorem ipsum-6",
          desc:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. \n Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum. ",
          priority: "Hight Priority",
          createDate: new Date(),
          id: 5
        }
      ]
    };
  },
  methods: {
    setDate() {
      var a = new Date();
      return a;
    },
    firstLetter(index) {
      //METHOD FOR LETTER BEFORE TITLE IN TASKS LIST
      var title = this.tasks[index].title;
      return title.substr(0, 1).toUpperCase();
    },
    firstLetterSolved(index) {
      //METHOD FOR LETTER BEFORE TITLE IN SOLVED TASKS LIST
      var title = this.solvedTasks[index].title;
      return title.substr(0, 1).toUpperCase();
    },
    onClick: function() {
      //METHOD FOR SHOW/HIDE SIDEBAR
      this.show = !this.show;
    },
    removeTask: function(task) {
      var index = this.tasks.indexOf(task);
      this.tasks.splice(index, 1);
    },
    removeSolvedTask: function(solvedTask) {
      var index = this.solvedTasks.indexOf(solvedTask);
      console.log(" " + index);
      this.solvedTasks.splice(index, 1);
    },
    returnInToDo: function(solvedTask) {
      //METHOD FOR MARK TASK ACTIVE
      var index = this.solvedTasks.indexOf(solvedTask);
      this.tasks.unshift(solvedTask);
      this.solvedTasks.splice(index, 1);
    },
    complete: function(task) {
      //METHOD FOR MARK TASK COMPLETE
      var index = this.tasks.indexOf(task);
      this.solvedTasks.unshift(task);
      this.tasks.splice(index, 1);
    },
    setEditIndex(index) {
      //FIND TASK FOR EDIT
      this.editIndex = index;
    },
    saveTask(index) {
      // SAVE TASK AFTER EDIT
      this.editTask.title != 0
        ? (this.tasks[this.editIndex].title = this.editTask.title)
        : null;

      this.editTask.desc != 0
        ? (this.tasks[this.editIndex].desc = this.editTask.desc)
        : null;

      this.editTask.title.priority != this.tasks[this.editIndex].priority
        ? (this.tasks[this.editIndex].priority = this.editTask.priority)
        : null;

      this.editTask.title = "";
      this.editTask.desc = "";
    },
    addTask() {
      if (this.newTask.title != "") {
        this.tasks.unshift({
          title: this.newTask.title,
          desc: this.newTask.desc,
          priority: this.newTask.priority,
          createDate: new Date(),
          id: this.id
        });
        this.id++;
        console.log(this.placement);
        this.newTask.title = "";
        this.newTask.desc = "";
        this.newTask.priority = "Hight Priority";
        this.placement === "tile" ? this.tileElement() : null;
      }
    },
    selectPriority(priority) {
      //METHOD FOR PRIORITY FILTER
      priority === "Hight Priority"
        ? (this.newTask.priority = "Hight Priority")
        : null;
      priority === "Medium Priority"
        ? (this.newTask.priority = "Medium Priority")
        : null;
      priority === "Low Priority"
        ? (this.newTask.priority = "Low Priority")
        : null;
    },
    sortTasks() {
      //METHOD FOR SORT BY DATE
      this.sortDirection = !this.sortDirection;
      this.sortDirection == true
        ? this.tasks.sort((next, prev) => next.createDate - prev.createDate)
        : this.tasks.sort((prev, next) => next.createDate - prev.createDate);
    },
    tileElement() {
      //METHOD FOR CHANGE PLACEMENT ELEMENTS
      this.placement = "tile";
      var rowBlocks = document.querySelectorAll(".place-tile");
      var tileSize = document.querySelectorAll(".task-block");
      var hideElements = document.querySelectorAll(".hide-el");

      rowBlocks.forEach(element => {
        element.style.display = "flex";
      });

      //tileSize.forEach(element => {
      // element.style.width = "30%";
      //});

      hideElements.forEach(element => {
        element.style.display = "none";
      });
    }
  },
  computed: {
    displayTasks: function() {
      var priority = this.priorityFilter;

      if (priority === "Select priority") {
        return this.tasks;
      } else {
        return this.tasks.filter(function(task) {
          return task.priority === priority;
        });
      }
    }
  },
  components: {
    draggable
  },
  filters: {
    dataFilter: function(value) {
      return moment(value).format("dddd, MMMM DD YYYY, h:mm:ss");
    }
  }
};
</script>

<style>
@import url("../node_modules/@fortawesome/fontawesome-free/css/all.css");
@import url(//db.onlinewebfonts.com/c/b09257add40c807d5566ce0749279050?family=URWRadiantW01-Heavy);
@import url(style.css);
</style>
