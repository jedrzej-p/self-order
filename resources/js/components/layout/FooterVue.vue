<template>
    <footer class="site-footer z2">
        <div class="container">
            <div class="row mx-0">
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
            <div class="row mx-0">
                <div class="col-md-8 col-sm-6 col-12">
                    <p class="copyright-text pb-3">Copyright &copy; 2021 SelfOrder</p>
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
  padding: 25px 0 20px;
  font-size: 15px;
  line-height: 24px;
}

.site-footer hr {
  border-top-color: #bbb;
  opacity: 0.5;
}

.site-footer hr.small {
  margin: 15px 0;
}

.site-footer h3 {
  font-size: 16px;
  text-transform: uppercase;
  margin-top: 5px;
  letter-spacing: 2px;
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

.footer-links.inline li {
  display: inline;
}

.copyright-text {
  margin: 0;
}

@media (max-width: 991px) {
  .cont-mobile {
    padding-left: unset;
    padding-right: unset;
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
