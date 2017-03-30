$(function (){

  let map;

  function initMap(lat, lng) {
    map = new google.maps.Map(document.getElementsByClassName('modal-map')[0], {
      center: {lat: lat, lng: lng},
      zoom: 8
    });
  };

  const model = {
    info: null,
    init: function () {
      const request = new Request('spy.json', {
        method: 'GET', 
        mode: 'cors', 
        redirect: 'follow',
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      });
      return fetch(request)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            console.log('Encountered errors!');
          }
        })
        .then(json => {
          this.info = json;
        })
    },
    currentPic: null
  };

  const octopus = {
    getInfo: function () {
      return model.info;
    },
    getSingleInfo: function (index) {
      return model.info[index];
    },
    init: function () {
      model.init()
        .then(() => {
          infoView.init();
          infoListView.init();
          modalView.init();
        })
    },
    openModal: function (info) {
      modalView.render(info);
      modalView.open();
    },
    filterCategory(category) {
      if (category == 'All') {
        return this.getInfo()
      }
      return this.getInfo().filter(info => {
        return info.category == category
      })
    },
    render: function (model) {
      infoView.render(model);
    }
  };

  const infoView = {
    init: function () {
      this.infoGallery = $('.display');
      this.render(octopus.getInfo());
    },
    render: function (model) {
      let infoHtml = '';
      model.forEach((info) => {
        infoHtml += '<figure class="info column is-one-third"><img src="' + info.thumbnail + '"/><h1 class="info-heading">' + info.title + '</h1><h2><strong>Taken: </strong>' + info.time + '</h2><p class="info-subheading">' + info.details + '</p><button class="button info-modal">View</button></figure>';
      });
      this.infoGallery.html(infoHtml);

      this.infoGallery.off().on('click', '.info-modal', function () {
        const currentIndex = $(this).closest('.info').index();
        octopus.openModal(octopus.getSingleInfo(currentIndex));
      });
    }
  };

  const infoListView = {
    init: function () {
      this.infoList = $('.display-list');
      this.render();
    },
    render: function () {
      let listHtml = '<li>All</li>';
      let categoryArr = [];
      octopus.getInfo().forEach((info) => {
        if (!categoryArr.some((category) => {return category == info.category})) {
          categoryArr.push(info.category);
        }
      });
      categoryArr.forEach(function (category) {
        listHtml += '<li>' + category + '</li>';
      });

      this.infoList.on('click', 'li', function () {
        const currentCategory = $(this).text();
        const currentModel = octopus.filterCategory(currentCategory);
        console.log(currentModel);
        octopus.render(currentModel);
      });
      this.infoList.html(listHtml);
    },
  }

  let modalView = {
    init: function () {
      this.modal = $('.modal');
      this.modalImg = $('.modal-img');
      this.modalHeading = $('.modal-heading');

      $('.modal-close').click(() => {
        modalView.close();
      });
    },
    render: function (info) {
      this.modalImg.attr('src', info.image);
      this.modalHeading.text(info.title);
      initMap(info.coordinates.lat, info.coordinates.lng);
    },
    open: function () {
      this.modal.addClass('is-active');
    },
    close: function () {
      this.modal.removeClass('is-active');
    }
  };

  octopus.init();
});