<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            {{$t('app.qlcm.dscm')}}
          </a>
          <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
            <li class="dropdown-submenu">
              <a class="dropdown-item" href="#">VĂN BẢN QUY ĐỊNH PL</a>
              <ul class="dropdown-submenu">
                <li><a class="dropdown-item" href="#">Hiến pháp</a></li>
                <li><a class="dropdown-item" href="#">Sắc lệnh - sắc luật</a></li>
                <li><a class="dropdown-item" href="#">Luật - Pháp lệnh</a></li>
                <li><a class="dropdown-item" href="#">Nghị định</a></li>
                <li><a class="dropdown-item" href="#">Quyết định</a></li>
                <li><a class="dropdown-item" href="#">Thông tư</a></li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </nav>
</template>
<style src="../assets/css/qlcm.css"></style>
<script>
export default {
  name: 'DropdownMenu'
}
</script>

