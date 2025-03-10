document.addEventListener("DOMContentLoaded", function () {
    var map = L.map('map').setView([36.72016, -4.42034], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    var studioIcon = L.icon({
        iconUrl: '/images/studio.png',
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -38]
    });

    fetch('da_cultura_ocio_monumentos-4326.geojson')
        .then(response => response.json())
        .then(data => {
            L.geoJSON(data, {
                pointToLayer: function (feature, latlng) {
                    var marker = L.marker(latlng, { icon: studioIcon });
                    marker.on('click', function () {
                        Swal.fire({
                            title: feature.properties.NOMBRE,
                            text: feature.properties.DESCRIPCION,
                            imageUrl: 'images/studio.png',
                            imageWidth: 50,
                            imageHeight: 50,
                            imageAlt: 'Custom image',
                            confirmButtonText: 'OK'
                        });
                    });
                    return marker;
                }
            }).addTo(map);

            var listContainer = document.getElementById('list-container');
            if (!listContainer) {
                listContainer = document.createElement('div');
                listContainer.id = 'list-container';
                listContainer.style.marginTop = '20px';
                document.body.appendChild(listContainer);
            } else {
                listContainer.innerHTML = '';
            }

            var list = document.createElement('ul');
            list.classList.add('list-group');
            data.features.forEach(feature => {
                var listItem = document.createElement('li');
                listItem.textContent = feature.properties.NOMBRE;
                listItem.classList.add('list-group-item', 'list-group-item-action');
                listItem.addEventListener('click', function () {
                    var coords = feature.geometry.coordinates;
                    var latlng = L.latLng(coords[1], coords[0]);
                    map.setView(latlng, 16);
                });
                list.appendChild(listItem);
            });
            listContainer.appendChild(list);
        })
        .catch(error => console.error('Error fetching GeoJSON:', error));
});

