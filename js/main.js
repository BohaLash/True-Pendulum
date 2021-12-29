var canvas = document.getElementById('pendulum')
var ctx = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

const g = 9.8 // m*s^-2
const output_scale = 300
const input_scale = 100
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
        let x = this.canvas_x, 
            y = this.canvas_y
        ctx.beginPath()
        ctx.moveTo(x0, y0)
        ctx.lineTo(x, y)
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(x, y, r, 0, 2 * Math.PI, false)
        ctx.fill()
        ctx.stroke()
    }

    get canvas_x() {
        return this.x * output_scale + x0
    }

    get canvas_y() {
        return this.y * output_scale + y0
    }

    resetTime() {
        this.t0 = Date.now()
    }
}

var paused = false

var pendulum = new Pendulum(1, 3)

var interval = setInterval(() => {
    if (!paused) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        pendulum.render()
        pendulum.calcul()
    }
}, 0)

var m_x0, m_y0
var p_x, p_y

canvas.onmousedown = (event) => {
    paused = true

    m_x0 = event.clientX
    m_y0 = event.clientY

    p_x = pendulum.canvas_x
    p_y = pendulum.canvas_y

    canvas.onmousemove = (event) => {
        let dx = event.clientX - m_x0,
            dy = event.clientY - m_y0

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        pendulum.render()
        
        ctx.beginPath();
        ctx.moveTo(p_x, p_y)
        ctx.lineTo(p_x + dx * 0.5, p_y + dy * 0.5)
        ctx.stroke()
    }
}

canvas.onmouseup = (event) => {
    canvas.onmousemove = undefined

    let dx = event.clientX - m_x0,
        dy = m_y0 - event.clientY,
        v = Math.sqrt(dx*dx + dy*dy) / input_scale
        a = Math.atan(dx/dy) + Math.PI * (2 * (dx > 0) * (dy < 0) + (dy > 0))
        vn = - v * Math.sin(pendulum.f + a)

    if (vn) pendulum.w += vn / pendulum.l
    pendulum.resetTime()

    paused = false
}

// setTimeout(() => clearInterval(interval), 5000)
