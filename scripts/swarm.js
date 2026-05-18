import * as THREE from 'three';

const container = document.getElementById('swarm-container');
if (container) {
    const COUNT = 8000; // Optimal density for the particle sphere
    const width = container.clientWidth || 450;
    const height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 0, 58); // Centered camera distance (brought closer to fill the card)

    // Setup 100% transparent WebGL renderer
    const renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        powerPreference: "high-performance",
        alpha: true 
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // Fully transparent background
    container.appendChild(renderer.domElement);

    // Website Brand Colors (Indigo-Blue to Magenta Gradient)
    const color1 = new THREE.Color(0x1e30f3);
    const color2 = new THREE.Color(0xe21e80);

    // BUILD PARTICLES GEOMETRY
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const r = 24; // Sphere radius

    for (let i = 0; i < COUNT; i++) {
        // Uniform mathematical sphere distribution
        const phi = Math.acos(-1 + (2 * i) / COUNT);
        const theta = Math.sqrt(COUNT * Math.PI) * phi;
        
        const x = r * Math.cos(theta) * Math.sin(phi);
        const y = r * Math.sin(theta) * Math.sin(phi);
        const z = r * Math.cos(phi);

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        // Soft volumetric height-based color gradient
        const t = (y + r) / (2 * r);
        const pColor = new THREE.Color().copy(color1).lerp(color2, t);
        
        // Add subtle variation to colors for extra holographic depth
        pColor.offsetHSL((Math.random() - 0.5) * 0.04, 0.05, 0);

        colors[i * 3] = pColor.r;
        colors[i * 3 + 1] = pColor.g;
        colors[i * 3 + 2] = pColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle Points Material - sharp, tiny, glow-free voxel dots
    const material = new THREE.PointsMaterial({
        size: 0.35, // Tiny, ultra-crisp holographic points
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.NormalBlending, // Blends perfectly on white background
        depthWrite: false
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Super lightweight animation loop (0% CPU overhead, smooth GPU rotation)
    const clock = new THREE.Clock();
    
    function animate() {
        requestAnimationFrame(animate);
        
        const time = clock.getElapsedTime();
        
        // Smooth continuous 3D rotation
        points.rotation.y = time * 0.22;
        points.rotation.x = time * 0.11;

        renderer.render(scene, camera);
    }
    animate();

    // Resize handler
    window.addEventListener('resize', () => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    });
}
