const tasks_new = (title, desc, priority, label) => ({
    title,
    desc,
    priority,
    label
});

var vue = new Vue({
    el: "#app",
    data: {
        show: true,
        date: "date",
        editIndex: 0,
        sortDirection: true,
        priorityFilter: "Select priority",
        search: "",
        newTask: {
            title: "",
            desc: "",
            priority: "Hight Priority",
            createDate: new Date()
        },
        editTask: {
            title: "",
            desc: "",
            priority: "Hight Priority",
            createDate: new Date()
        },
        tasks: [{
                title: "Изучить основы vue.js",
                desc: "Попробовать написать калькулятор",
                priority: "Hight Priority",
                createDate: "date"
            },
            {
                title: 'Прочитать книгу "Vue.js в действии"',
                desc: "desk",
                priority: "Hight Priority",
                createDate: "date"
            },
            {
                title: 'Прочитать книгу "Vue.js в действии"',
                desc: "desk",
                priority: "Hight Priority",
                createDate: "date"
            }
        ],
        solvedTasks: [{
                title: "Изучить основы vue.js",
                desc: "Попробовать написать калькулятор",
                priority: "Hight priority",
                createDate: "date"
            },
            {
                title: 'Прочитать книгу "Vue.js в действии"',
                desc: "desk",
                priority: "Hight Priority",
                createDate: "date"
            },
            {
                title: 'Прочитать книгу "Vue.js в действии"',
                desc: "desk",
                priority: "Hight Priority",
                createDate: "date"
            }
        ]
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
            this.editTask.title != 0 ?
                (this.tasks[this.editIndex].title = this.editTask.title) :
                null;

            this.editTask.desc != 0 ?
                (this.tasks[this.editIndex].desc = this.editTask.desc) :
                null;

            this.editTask.title.priority != this.tasks[this.editIndex].priority ?
                (this.tasks[this.editIndex].priority = this.editTask.priority) :
                null;

            this.editTask.title = "";
            this.editTask.desc = "";
        },
        addTask() {
            if (this.newTask.title != "") {
                this.tasks.unshift({
                    title: this.newTask.title,
                    desc: this.newTask.desc,
                    priority: this.newTask.priority,
                    createDate: new Date()
                });
                this.newTask.title = "";
                this.newTask.desc = "";
                this.newTask.priority = "Hight Priority";
            }
        },
        selectPriority(priority) {
            priority === "Hight Priority" ?
                (this.newTask.priority = "Hight Priority") :
                null;
            priority === "Medium Priority" ?
                (this.newTask.priority = "Medium Priority") :
                null;
            priority === "Low Priority" ?
                (this.newTask.priority = "Low Priority") :
                null;
        },
        sortTasks() {
            this.sortDirection = !this.sortDirection;
            this.sortDirection == true ?
                this.tasks.sort((next, prev) => next.createDate - prev.createDate) :
                this.tasks.sort((prev, next) => next.createDate - prev.createDate);
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
    }
});