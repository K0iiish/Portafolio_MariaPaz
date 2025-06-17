// ==============================
// TEXT CHANGER ("HI THERE")
// ==============================
const texts = ["UI/UX Designer", "Digital Designer", "Frontend Designer"];
let index = 0;
const el = document.getElementById("changing-text");

setInterval(() => {
  el.style.opacity = 0;
  setTimeout(() => {
    index = (index + 1) % texts.length;
    el.textContent = texts[index];
    el.style.opacity = 1;
  }, 300);
}, 2000);


// ==============================
// FLOATING STICKERS (solo en .hero)
// ==============================
document.addEventListener("DOMContentLoaded", function () {
  const allImages = [
    'img/gato_1.png',
    'img/gato_2.png',
    'img/gato_3.png',
    'img/gato_4.png',
    'img/gato_5.png',
    'img/gato_6.png',
    'img/gato_7.png',
    'img/gato_8.png'
  ];

  let count = 0;
  const heroSection = document.querySelector('.hero');
  const container = document.querySelector('.floating-images-container');

  function randomNumber() {
    return Math.floor(Math.random() * allImages.length);
  }

  function loadImage(x, y) {
    const newImage = new Image();
    newImage.src = allImages[randomNumber()];
    newImage.style.position = "absolute";
    newImage.style.opacity = "1";
    newImage.style.transition = "opacity 0.5s ease";

    newImage.onload = function () {
      newImage.setAttribute('id', `img-${count}`);
      newImage.style.left = `${x - newImage.width / 2}px`;
      newImage.style.top = `${y - newImage.height / 2}px`;
      container.appendChild(newImage);

      setTimeout(() => {
        newImage.style.opacity = '0';
        setTimeout(() => newImage.remove(), 500);
      }, 3000);

      count++;
    };
  }

  if (heroSection && container) {
    heroSection.addEventListener('click', function (event) {
      const rect = heroSection.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      loadImage(x, y);
    });
  } else {
    console.warn("No se encontró la sección .hero o el contenedor .floating-images-container");
  }
});



// ==============================
// ABOUT ME: Mouse efecto en etiquetas
// ==============================
const tags = document.querySelectorAll(".skill-tag");

document.addEventListener("mousemove", (e) => {
  tags.forEach((tag) => {
    const rect = tag.getBoundingClientRect();
    const tagCenterX = rect.left + rect.width / 2;
    const tagCenterY = rect.top + rect.height / 2;

    const deltaX = e.clientX - tagCenterX;
    const deltaY = e.clientY - tagCenterY;
    const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

    if (distance < 150) {
      const moveX = -deltaX / 20;
      const moveY = -deltaY / 20;
      tag.style.transform = `translate(${moveX}px, ${moveY}px)`;
    } else {
      tag.style.transform = `translate(0, 0)`;
    }
  });
});


// ==============================
// ABOUT ME: Chips con física
// ==============================
function iniciarChipsConFisica() {
  const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint } = Matter;

  const container = document.getElementById('chip-container');
  const engine = Engine.create();
  const world = engine.world;

  let width = container.clientWidth;
  let height = container.clientHeight;

  const render = Render.create({
    element: container,
    engine: engine,
    options: {
      width,
      height,
      wireframes: false,
      background: 'transparent'
    }
  });

  Render.run(render);
  Runner.run(Runner.create(), engine);

  const allColors = [
    { label: "SUITE ADOBE", color: "#9ff1ff" },
    { label: "BLIPPAR", color: "#9effc5" },
    { label: "BOOTSTRAP", color: "#c899ff" },
    { label: "FIGMA", color: "#ff9fe9" },
    { label: "C#", color: "#9ea6ff" },
    { label: "HTML", color: "#ffcc8a" },
    { label: "VISUAL STUDIO", color: "#f699ff" },
    { label: "CSS", color: "#9effa7" },
    { label: "ARDUINO", color: "#f6ff8e" },
    { label: "UNITY", color: "#ffe891" },
    { label: "PS5.JS", color: "#ffb59e" },
    { label: "PROCREATE", color: "#a8ceff" },
    { label: "FUSION 360", color: "#ff9ea6" }
  ];

  function getChipCount(containerWidth) {
    if (containerWidth < 400) return 4;
    if (containerWidth < 768) return 6;
    if (containerWidth < 1024) return 9;
    return allColors.length;
  }

  const chipCount = getChipCount(width);

  const chips = allColors.slice(0, chipCount).map(item =>
    Bodies.rectangle(
      Math.random() * width,
      Math.random() * height,
      item.label.length * 13 + 40,  // ancho visual tipo "pill"
      42,
      {
        restitution: 0.9,
        frictionAir: 0.05,
        chamfer: { radius: 20 }, // 🎯 Bordes redondeados
        render: {
          fillStyle: item.color,
          strokeStyle: '#000000',
          lineWidth: 1,
        },
        label: item.label
      }
    )
  );

  Composite.add(world, chips);

  let walls = createWalls(width, height);
  Composite.add(world, walls);

  const mouse = Mouse.create(render.canvas);
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse,
    constraint: {
      stiffness: 0.2,
      render: { visible: false }
    }
  });
  Composite.add(world, mouseConstraint);
  render.mouse = mouse;

  const resizeObserver = new ResizeObserver(entries => {
    for (let entry of entries) {
      const newWidth = entry.contentRect.width;
      const newHeight = entry.contentRect.height;

      render.canvas.width = newWidth;
      render.canvas.height = newHeight;
      render.options.width = newWidth;
      render.options.height = newHeight;

      Composite.remove(world, walls);
      walls = createWalls(newWidth, newHeight);
      Composite.add(world, walls);
    }
  });

  resizeObserver.observe(container);

  function createWalls(w, h) {
    const wallOptions = {
      isStatic: true,
      render: { visible: false } // 
    };
    return [
      Bodies.rectangle(w / 2, 0, w, 20, wallOptions),
      Bodies.rectangle(w / 2, h, w, 20, wallOptions),
      Bodies.rectangle(0, h / 2, 20, h, wallOptions),
      Bodies.rectangle(w, h / 2, 20, h, wallOptions)
    ];
  }
  
  // Crear etiquetas HTML para cada chip
const labels = [];

chips.forEach((chip, i) => {
  const label = document.createElement('div');
  label.className = 'matter-label';
  label.innerText = chip.label;
  container.appendChild(label);
  labels.push({ labelEl: label, body: chip });
});

// Actualizar posición de las etiquetas en cada frame
(function updateLabels() {
  requestAnimationFrame(updateLabels);
  labels.forEach(({ labelEl, body }) => {
    labelEl.style.left = `${body.position.x}px`;
    labelEl.style.top = `${body.position.y}px`;
  });
})();

}

iniciarChipsConFisica();
