var canvas = document.getElementById('pendulum')
var ctx = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

const g = 9.8 // m*s^-2
const scale = 300
const timestep = 0.00001 // s
const timestep_ms = timestep * 1000 // ms

const x0 = canvas.width / 2
const y0 = canvas.height / 2

const r = 10
ctx.strokeStyle = 'black'
ctx.fillStyle = 'lightgray';
ctx.lineWidth = 2

class Pendulum {
    constructor(length = 1, initial_angle = 0) {
        this.t0 = Date.now() // ms

        this.l = length // m
        this.g_l = - g / length

        this.f = initial_angle // rad
        this.w = 0 // rad*s^-1
        this.a = 0 // rad*s^-2
    }

    get dt() {
        return Date.now() - this.t0
    }

    calcul() {
        // console.log(this.dt / timestep_ms)
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
        let x = this.x * scale + x0, 
            y = this.y * scale + y0
        ctx.beginPath()
        ctx.moveTo(x0, y0)
        ctx.lineTo(x, y)
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(x, y, r, 0, 2 * Math.PI, false)
        ctx.fill()
        ctx.stroke()
    }
}

var pendulum = new Pendulum(1, 3)

var interval = setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    pendulum.render()
    pendulum.calcul()
}, 0)

// setTimeout(() => clearInterval(interval), 5000)
