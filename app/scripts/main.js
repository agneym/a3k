(function () {
	'use strict';

	var Starfield = (function () {
		var windowWidth, windowHeight, windowHalfWidth, windowHalfHeight;
		var camera, scene, renderer;
		var starfield;
		var mouseX = 0, mouseY = 0;
		var geometry = new THREE.SphereGeometry(5, 32, 40);
		THREE.Cache.enabled = true;

		function initialize() {
			if (!Detector.webgl)
				Detector.addGetWebGLMessage();
			measure();
			setupCamera();
			setupScene();
			createRenderer();
			// Event listeners
			document.addEventListener("mousemove", onMouseMove);
			document.body.addEventListener('touchstart', function (e) {
				var touchobj = e.changedTouches[0];
				mouseX = touchobj.clientX - windowHalfWidth;
				mouseY = touchobj.clientY - windowHalfHeight;
			});
			window.addEventListener("resize", onResize);
		}

		function measure() {
			windowWidth = window.innerWidth;
			windowHeight = window.innerHeight;
			windowHalfWidth = window.innerWidth / 2;
			windowHalfHeight = window.innerHeight / 2;
		}

		function setupCamera() {
			if (!camera) {
				camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 3000);
				camera.position.z = 1000;
			}
		}

		function setupScene() {
			if (!scene) {
				scene = new THREE.Scene();

				starfield = new THREE.Object3D();
				addCelestialObjectsTo(starfield, 100);
				scene.add(starfield);
			}
		}

		function createRenderer() {
			if (!renderer) {
				renderer = new THREE.WebGLRenderer();
				renderer.setSize(windowWidth, windowHeight);
				document.getElementById('container').appendChild(renderer.domElement);
			}
		}

		function addCelestialObjectsTo(group, max) {
			var celObj;

			for (var i = 0; i < max; ++i) {
				celObj = new THREE.Points(geometry);
				celObj.position.x = Math.random() * 2000 - 1000;
				celObj.position.y = Math.random() * 2000 - 1000;
				celObj.position.z = Math.random() * 2000 - 800;
				group.add(celObj);
			}
		}

		function onMouseMove(e) {
			mouseX = e.clientX - windowHalfWidth;
			mouseY = e.clientY - windowHalfHeight;
		}

		function onTouch(e) {
			mouseX = touchobj.clientX - windowHalfWidth;
			mouseY = touchobj.clientY - windowHalfHeight;
		}

		function onResize() {
			measure();

			if (camera)
				camera.aspect = windowWidth / windowHeight;

			if (renderer)
				renderer.setSize(windowWidth, windowHeight);
		}
		function animate() {
			requestAnimationFrame(animate);
			render();
		}

		function render() {
			camera.position.x += (mouseX - camera.position.x) * 0.05;
			camera.position.y += (- mouseY - camera.position.y) * 0.05;

			starfield.rotation.x += 0.005;
			starfield.rotation.y += 0.01;

			renderer.render(scene, camera);
		}


		return {
			initialize: initialize,
			startAnimation: animate
		};
	})();

	// Check to make sure service workers are supported in the current browser,
	// and that the current page is accessed from a secure origin. Using a
	// service worker from an insecure origin will trigger JS console errors. See
	// http://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features
	var isLocalhost = Boolean(window.location.hostname === 'localhost' ||
		// [::1] is the IPv6 localhost address.
		window.location.hostname === '[::1]' ||
		// 127.0.0.1/8 is considered localhost for IPv4.
		window.location.hostname.match(
			/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
		)
	);

	if ('serviceWorker' in navigator &&
		(window.location.protocol === 'https:' || isLocalhost)) {
		navigator.serviceWorker.register('service-worker.js')
			.then(function (registration) {
				// updatefound is fired if service-worker.js changes.
				registration.onupdatefound = function () {
					// updatefound is also fired the very first time the SW is installed,
					// and there's no need to prompt for a reload at that point.
					// So check here to see if the page is already controlled,
					// i.e. whether there's an existing service worker.
					if (navigator.serviceWorker.controller) {
						// The updatefound event implies that registration.installing is set:
						// https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-container-updatefound-event
						var installingWorker = registration.installing;

						installingWorker.onstatechange = function () {
							switch (installingWorker.state) {
								case 'installed':
									// At this point, the old content will have been purged and the
									// fresh content will have been added to the cache.
									// It's the perfect time to display a "New content is
									// available; please refresh." message in the page's interface.
									break;

								case 'redundant':
									throw new Error('The installing ' +
										'service worker became redundant.');

								default:
								// Ignore
							}
						};
					}
				};
			}).catch(function (e) {
				console.error('Error during service worker registration:', e);
			});
	}

	// Your custom JavaScript goes here
	Starfield.initialize();
	Starfield.startAnimation();

	document.getElementById('more-btn').addEventListener('click', function() {
		document.getElementsByClassName("dropdown-content")[0].classList.toggle("dropdown-show");
	});
})();
