<template>
    <footer class="site-footer z2">
        <div class="container">
            <div class="row">
                <div class="col-12 col-md-6">
                    <h3>Self-Order</h3>
                    <ul class="footer-links">
                        <li><p>ul. Superowa</p></li>
                        <li><p>61-702 Poznań</p></li>
                    </ul>
                </div>
                <div class="col-12 col-md-3">
                    <h3>Kontakt</h3>
                    <ul class="footer-links">
                        <li><p>Telefon: <a href="tel:+48123456789" title="Numer telefonu">+48 123 45 67 89</a></p></li>
                        <li><p>Email: <a href="mailto:supermail@wp.pl" title="Adres e-mail">supermail@wp.pl</a></p></li>
                    </ul>
                </div>
            </div>
            <hr>
        </div>
        <div class="container">
            <div class="row">
                <div class="col-md-8 col-sm-6 col-12">
                    <p class="copyright-text">Copyright &copy; 2021 SelfOrder</p>
                </div>
            </div>
        </div>
    </footer>
</template>

<script>
export default {
    data() {
        return {};
    },
    methods: {
        moment() {
            return window.moment();
        },
    },
};
</script>

<style lang="scss" scoped>
.site-footer {
  background-color: #f8f9fa !important;
  padding: 25px 0 20px;
  font-size: 15px;
  line-height: 24px;
  color: #b3b3b3;
}

.site-footer hr {
  border-top-color: #bbb;
  opacity: 0.5;
}

.site-footer hr.small {
  margin: 20px 0;
}

.site-footer h3 {
  color: #737373;
  font-size: 16px;
  text-transform: uppercase;
  margin-top: 5px;
  letter-spacing: 2px;
}

.site-footer a {
  color: #737373;
}

.site-footer a:hover {
  color: white;
  text-decoration: none;
}

.footer-links {
  padding-left: 0;
  list-style: none;
}

.footer-links li {
  display: block;
}

.footer-links a {
  color: #737373;
}

.footer-links a:focus,
.footer-links a:active,
.footer-links a:hover {
  color: #737373;
  text-decoration: none;
}

.footer-links.inline li {
  display: inline;
}

.copyright-text {
  margin: 0;
}

@media (max-width: 991px) {
  .site-footer [class^=col-] {
    margin-bottom: 5px;
  }

  .cont-mobile {
    padding-left: unset;
    padding-right: unset;
  }

  footer {
    position: relative;
  }
}

@media (max-width: 767px) {
  .site-footer {
    padding-bottom: 0;
  }

  .display-4 {
    font-size: 3rem;
  }
}</style>
