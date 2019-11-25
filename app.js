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
        date: "Date",
        new_task: {
            title: "",
            desc: "",
            priority: "",
            createDate: ""
        },
        editingTask: {},
        tasks: [{
                title: "Изучить основы vue.js",
                desc: "Попробовать написать калькулятор",
                priority: "High priority",
                createDate: "date"
            },
            {
                title: 'Прочитать книгу "Vue.js в действии"',
                desc: "desk",
                priority: "High priority",
                createDate: "date"
            },
            {
                title: 'Прочитать книгу "Vue.js в действии"',
                desc: "desk",
                priority: "High priority",
                createDate: "date"
            }
        ],

        solvedTasks: [{
                title: "Изучить основы vue.js",
                desc: "Попробовать написать калькулятор",
                priority: "High priority",
                createDate: "date"
            },
            {
                title: 'Прочитать книгу "Vue.js в действии"',
                desc: "desk",
                priority: "High priority",
                createDate: "date"
            },
            {
                title: 'Прочитать книгу "Vue.js в действии"',
                desc: "desk",
                priority: "High priority",
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
        }
    }
});