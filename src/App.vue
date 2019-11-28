<template>
  <div class="container" id="app">
    <div class="d-flex flex-row justify-content-between">
      <div class="left-bar">
        <h1>To Do</h1>
      </div>
      <div class="p-2"></div>
      <!--ADD MODAL-->
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
              <input class="form-text" placeholder="New task" type="text" v-model="newTask.title" />
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
              ></textarea>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" class="btn btn-success" @click="addTask">Add</button>
            </div>
          </div>
        </div>
      </div>
      <div class="p-2">
        <div class="btn-group">
          <button
            type="button"
            class="btn btn-danger"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >{{ priorityFilter }}</button>
          <button type="button" class="btn btn-danger" @click="priorityFilter = 'Select priority'">X</button>
          <div class="dropdown-menu">
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

      <div class="p-2">
        <button type="button" class="btn btn-primary" @click="sortTasks()">Sort by date</button>
      </div>

      <div class="p-2">
        <button
          type="button"
          class="btn btn-primary"
          data-toggle="modal"
          data-target="#addModal"
        >+ Add To Do</button>
      </div>

      <div class="p-2"></div>
    </div>

    <div class="d-flex flex-row justify-content-between">
      <!--HIDE SIDEBAR-->
      <button class="align-self-start" @click="onClick">
        <i class="ion-navicon"></i>
      </button>
      <div class="d-flex justify-content-end">
        <!--ROW LIST-->
        <button @click="placement = false">
          <i class="ion-navicon"></i>
        </button>
        <!--TILE LIST-->
        <button @click="placement = true">
          <i class="ion-navicon"></i>
        </button>
      </div>
    </div>

    <div class="d-flex flex-row">
      <transition name="slide-fade">
        <aside class="left-bar-button" v-show="show">
          <hr />
          <div class="btn-group">
            <button class="btn btn-warning">HOME</button>
            <button class="btn btn-warning">SETTINGS</button>
          </div>
          <hr />
        </aside>
      </transition>

      <div class="task-container">
        <h3 class>{{"To Do: "+ tasks.length}}</h3>

        <div v-bind:class="{ placetile: placement }">
          <draggable class="list-group flex-wrap" :list="displayTasks" group="people" @change="log">
            <div
              class="task-block content list-group-item"
              v-bind:class="{ tileTaskBlock: placement }"
              v-for="(task, index) of displayTasks"
              ondragstart="drag(event)"
              :key="task.id"
            >
              <!--EDIT MODAL-->
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
                      <h5
                        class="modal-title"
                      >Current name - {{ task.title }} - {{ editTask.title }}:</h5>
                      <input
                        class="form-text"
                        placeholder="New task name"
                        type="text"
                        v-model="editTask.title"
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
                      ></textarea>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                      <button type="button" class="btn btn-success" @click="saveTask(index)">Save</button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="d-flex flex-row justify-content-between">
                <p>{{ task.title }}</p>
                <p>{{ task.priority }}</p>
                <p>{{ task.id }}</p>
                <p v-bind:class="{ hide: placement }">{{ task.createDate }}</p>
                <div class="btn-group dropleft">
                  <button
                    type="button"
                    class="btn btn-warning dropdown-toggle"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <i class="ion-navicon"></i>
                  </button>

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

              <div>
                <p v-bind:class="{ hide: placement }">> {{ task.desc }}</p>
              </div>
            </div>
          </draggable>
        </div>

        <h3 class>{{"Completed: "+ solvedTasks.length}}</h3>

        <div class="place-tile">
          <draggable class="list-group" :list="solvedTasks" group="people" @change="log">
            <div class="task-block content" v-for="solvedTask of solvedTasks" :key="solvedTask.id">
              <div class="d-flex flex-row justify-content-between">
                <p>{{ solvedTask.title }}</p>
                <p>{{ solvedTask.priority }}</p>
                <p>{{ solvedTask.createDate }}</p>
                <p>{{ solvedTask.id }}</p>
                <div class="btn-group dropleft">
                  <button
                    type="button"
                    class="btn btn-warning dropdown-toggle"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <i class="ion-navicon"></i>
                  </button>
                  <div class="dropdown-menu">
                    <a
                      class="dropdown-item btn-primaru"
                      @click="returnInToDo(solvedTask)"
                      href="#"
                    >Return in To Do</a>
                    <div class="dropdown-divider"></div>
                    <a
                      class="dropdown-item btn-danger active"
                      @click="removeSolvedTask(solvedTask)"
                      href="#"
                    >Delete Task</a>
                  </div>
                </div>
              </div>

              <div>
                <p>{{ solvedTask.desc }}</p>
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
          title: "Изучить основы vue.js",
          desc: "Попробовать написать калькулятор",
          priority: "Hight Priority",
          createDate: "date",
          id: 0
        },
        {
          title: 'Прочитать книгу "Vue.js в действии"',
          desc: "desk",
          priority: "Hight Priority",
          createDate: "date",
          id: 1
        },
        {
          title: 'Прочитать книгу "Vue.js в действии"',
          desc: "desk",
          priority: "Hight Priority",
          createDate: "date",
          id: 2
        }
      ],
      solvedTasks: [
        {
          title: "Изучить основы vue.js",
          desc: "Попробовать написать калькулятор",
          priority: "Hight priority",
          createDate: "date",
          id: 3
        },
        {
          title: 'Прочитать книгу "Vue.js в действии"',
          desc: "desk",
          priority: "Hight Priority",
          createDate: "date",
          id: 4
        },
        {
          title: 'Прочитать книгу "Vue.js в действии"',
          desc: "desk",
          priority: "Hight Priority",
          createDate: "date",
          id: 5
        }
      ]
    };
  },
  methods: {
    onClick: function() {
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
      var index = this.solvedTasks.indexOf(solvedTask);
      this.tasks.unshift(solvedTask);
      this.solvedTasks.splice(index, 1);
    },
    complete: function(task) {
      var index = this.tasks.indexOf(task);
      this.solvedTasks.unshift(task);
      this.tasks.splice(index, 1);
    },
    setEditIndex(index) {
      this.editIndex = index;
    },
    saveTask(index) {
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
      this.sortDirection = !this.sortDirection;
      this.sortDirection == true
        ? this.tasks.sort((next, prev) => next.createDate - prev.createDate)
        : this.tasks.sort((prev, next) => next.createDate - prev.createDate);
    },
    tileElement() {
      this.placement = "tile";
      var rowBlocks = document.querySelectorAll(".place-tile");
      var tileSize = document.querySelectorAll(".task-block");
      var hideElements = document.querySelectorAll(".hide-el");

      rowBlocks.forEach(element => {
        element.style.display = "flex";
      });

      tileSize.forEach(element => {
        element.style.width = "30%";
      });

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
  }
};
</script>

<style>
.detailed-car-image {
  height: 200px;
}

.pointer {
  cursor: pointer;
}

.left-bar-button {
  background-color: cornflowerblue;
  text-align: center;
  min-height: 95vh;
  width: 25%;
}

.left-bar {
  background-color: cornflowerblue;
  text-align: center;
  width: 20%;
}

.task-container {
  width: 100%;
}

.task-block {
  height: 100px;
  transition-property: width;
  background-color: grey;
  border: 10px solid burlywood;
}

.tileTaskBlock {
  width: 30%;
  height: 100px;
  transition-property: width;
  background-color: grey;
  border: 10px solid burlywood;
}

.hide {
  display: none;
}

.placetile {
  display: flex;
  flex: wrap;
  width: 100%;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
}

/* Анимации появления и исчезновения*/

.slide-fade-enter-active {
  transition: all 1s ease;
}

.slide-fade-leave-active {
  transition: all 0s cubic-bezier(1, 1, 0.8, 1);
}

.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(-10px);
  opacity: 0.5;
}

.dropdown-menu {
  width: 100%;
  background-color: rgba(255, 147, 147);
}
</style>
