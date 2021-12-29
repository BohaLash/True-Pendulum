var canvas = document.getElementById('pendulum')
var ctx = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

var g = 9.8 // m*s^-2
var l = 1
var output_scale = 300
var input_scale = 100
var timestep = 0.00001 // s
var timestep_ms = timestep * 1000 // ms

const x0 = canvas.width / 2
const y0 = canvas.height / 2

const bob_r = 10
ctx.strokeStyle = 'black'
ctx.fillStyle = 'lightgray'
ctx.lineWidth = 2

var g_inpt = document.getElementById('g')
var l_inpt = document.getElementById('l')
var scale_inpt = document.getElementById('scale')

var width_inpt = document.getElementById('width')
var stroke_inpt = document.getElementById('stroke')
var fill_inpt = document.getElementById('fill')

g_inpt.value = g
g_inpt.onchange = () => { 
    g = g_inpt.value
    pendulum.g_l = - g / l
}

l_inpt.value = l
l_inpt.onchange = () => { 
    l = l_inpt.value
    pendulum.l = l
}

scale_inpt.value = output_scale
scale_inpt.onchange = () => { output_scale = scale_inpt.value }

width_inpt.value = ctx.lineWidth
width_inpt.onchange = () => {  ctx.lineWidth = width_inpt.value }

stroke_inpt.value = ctx.strokeStyle
stroke_inpt.onchange = () => { ctx.strokeStyle = stroke_inpt.value }

fill_inpt.value = ctx.fillStyle
fill_inpt.onchange = () => { ctx.fillStyle = fill_inpt.value }

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
        ctx.arc(x, y, bob_r, 0, 2 * Math.PI, false)
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

var pendulum = new Pendulum(l, 3)

var interval = setInterval(() => {
    if (!paused) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        pendulum.render()
        pendulum.calcul()
    }
}, 0)

var v_el = document.getElementById('v')
var v_value = document.getElementById('v_value')
var m_x0, m_y0
var p_x, p_y

canvas.onmousedown = (event) => {
    paused = true
    v_el.style.display = ''

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

        v_value.innerText = (Math.sqrt(dx*dx + dy*dy) / input_scale).toPrecision(3)
    }
}

canvas.onmouseup = (event) => {
    canvas.onmousemove = undefined

    let dx = event.clientX - m_x0,
        dy = m_y0 - event.clientY,
        V = Math.sqrt(dx*dx + dy*dy) / input_scale
        a = Math.atan(dx/dy) + Math.PI * (2 * (dx > 0) * (dy < 0) + (dy > 0))
        Vn = - V * Math.sin(pendulum.f + a)

    if (Vn) pendulum.w += Vn / pendulum.l
    pendulum.resetTime()

    v_el.style.display = 'none'
    paused = false
}

// setTimeout(() => clearInterval(interval), 5000)
