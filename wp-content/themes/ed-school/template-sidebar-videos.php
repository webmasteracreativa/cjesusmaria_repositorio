<?php
/**
 * @package WordPress
 * @subpackage Wheels
 *
 * Template Name: Sidebar - Videos
 */
get_header();
?>
<?php get_template_part( 'templates/title' ); ?>
<div class="container">
    <ul class="nav nav-tabs" id="myTab" role="tablist">
      <li class="nav-item">
        <a class="nav-link active" id="home-tab" data-toggle="tab" href="#notimagazine" role="tab" aria-controls="home" aria-selected="true">NOTIMAGAZINE</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" id="profile-tab" data-toggle="tab" href="#teleconpaz" role="tab" aria-controls="profile" aria-selected="false">TELE CON PAZ</a>
      </li>
    </ul>
    <div class="tab-content" id="myTabContent">
      <div class="tab-pane fade show active" id="notimagazine" role="tabpanel" aria-labelledby="home-tab">
        <div class="swiper-container">
          <div class="swiper-wrapper">

          </div>
          <div class="swiper-button-prev"></div>
          <div class="swiper-button-next"></div>
          <div class="swiper-pagination"></div>
        </div>
      </div>
      <div class="tab-pane fade" id="teleconpaz" role="tabpanel" aria-labelledby="profile-tab">
        <div class="swiper-container">
          <div class="swiper-wrapper">
          </div>
          <div class="swiper-button-prev"></div>
          <div class="swiper-button-next"></div>
          <div class="swiper-pagination"></div>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body p-0">
          <iframe width="100%" height="600" src="" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
      </div>
    </div>
  </div>
<?php get_footer(); ?>
