# ✈️ Atmos — Cinematic 3D Web Experience

Atmos is an interactive, cinematic 3D flight experience built for the web using **React Three Fiber**, **Three.js**, and **GSAP**.  
The project focuses on smooth animations, scroll-driven camera movement, and responsive 3D layouts across devices.

🌐 **Live Demo:** https://atmos-silk.vercel.app/

---

## 🚀 Features

- ✈️ Curve-based airplane flight animation
- 🎥 Scroll-driven cinematic camera movement
- 🎨 Dynamic background color transitions using GSAP
- ☁️ Procedurally placed 3D clouds
- 🧭 Context-based play & animation control
- 📱 Fully responsive (desktop & mobile)
- ⚡ Optimized with `useMemo`, refs, and controlled re-renders

---

## 🛠️ Tech Stack

- **React**
- **React Three Fiber**
- **Three.js**
- **GSAP**
- **@react-three/drei**
- **Vite**

---

## 🧠 What I Learned

- Synchronizing **GSAP timelines** with `useFrame`
- Managing **camera logic** in 3D space
- Scroll-based motion using `ScrollControls`
- Performance optimization in WebGL scenes
- Structuring large R3F projects cleanly
- Making 3D experiences responsive across devices

---

## 📂 Project Structure

src/
├── components/
│ ├── Airplane.jsx
│ ├── Background.jsx
│ ├── Cloud.jsx
│ ├── TextSection.jsx
│ └── Experience.jsx
│
├── context/
│ └── Play.jsx
│
├── utils/
│ └── fadeMaterial.js
│
├── App.jsx
├── main.jsx
└── styles.css


---

## 📱 Responsiveness

- Adaptive camera **FOV & positioning**
- Mobile-friendly interaction and text spacing
- Optimized for both portrait and landscape screens

---

## 🧪 Performance Notes

- Heavy calculations memoized
- Geometry and vectors reused
- GSAP animations isolated from render loop
- No unnecessary React re-renders

---

## 🔮 Future Improvements

- Loading screen with progress indicator
- Sound design with mute toggle
- Keyboard / touch interaction support
- Performance stats overlay
- More cinematic camera transitions

---

## ⭐ Support

If you like this project or learned something from it, please consider giving it a **⭐ on GitHub** — it really helps and motivates me to build more!

---

## 👋 Connect With Me

Feel free to connect or share feedback — I’m always open to learning and improving.

Happy coding! 🚀
