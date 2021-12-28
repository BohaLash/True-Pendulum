var canvas = document.getElementById('pendulum')
var ctx = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

const g = 9.8 // m*s^-2
const scale = 50
const timestep = 0.0001 // s
const timestep_ms = timestep * 1000 // ms

ctx.strokeStyle = 'red'
ctx.lineWidth = 2

class Pendulum {
    constructor(
            length = 1, 
            initial_angle = 0, 
            initial_x = canvas.width / 2, 
            initial_y = 100, 
        ) {
        this.t0 = Date.now() // ms

        this.l = length // m
        this.g_l = - g / length

        this.f = initial_angle // rad
        this.w = 0 // rad*s^-1
        this.a = 0 // rad*s^-2

        this.x0 = initial_x // px
        this.y0 = initial_y // px
    }

    get dt() {
        return Date.now() - this.t0
    }

    calcul() {
        console.log(this.dt / timestep_ms)
        for (let i = 0; i < this.dt / timestep_ms; ++i) {
            this.a = this.g_l * Math.sin(this.f)
            this.w += this.a * timestep
            this.f += this.w * timestep
        }
        this.t0 = Date.now()
    }

    get x() {
        return this.l * Math.sin(this.f)
    }

    get y() {
        return this.l * Math.cos(this.f)
    }

    async render() {
        ctx.beginPath()
        ctx.moveTo(this.x0, this.y0)
        ctx.lineTo(
            this.x * scale + this.x0, 
            this.y * scale + this.y0,
        )
        ctx.stroke()
    }
}

var pendulum = new Pendulum(5, 3, canvas.width / 2, 300)

var interval = setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    pendulum.render()
    pendulum.calcul()
}, 0)

// setTimeout(() => clearInterval(interval), 5000)
