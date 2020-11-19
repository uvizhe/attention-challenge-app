<template>
  <q-page padding>
    <div class="text-h5 text-center q-mb-sm">Attention Challenge</div>
    <div class="text-justify">
      <p>
        {{ $t('aboutGreeting') }}, <strong>{{ $store.state.app.username }}</strong>!<br/>
        {{ $t('aboutP1') }}
      </p>
      <p>
        {{ $t('aboutP2') }}
      </p>
      <p>
        <svg xmlns="http://www.w3.org/2000/svg" width="300" height="100" >
          <rect x="0" y="0" width="300" height="100" style="fill: none; stroke: black; stroke-width: 1px;"/>
        </svg>
      </p>
      <p>
        {{ $t('aboutP3') }}
      </p>
      <p>
        {{ $t('aboutP4') }}
      </p>
    </div>
    <div>
      <div class="text-h6 q-mb-sm">{{ $t('aboutThanks') }}</div>
      <div>
        <ul>
          <li class="about-li">
            <a :href="$t('aboutThanksLi1A1Href')">{{ $t('aboutThanksLi1A1Text') }}</a>
            {{ $t('aboutThanksLi1Text') }}
            <a :href="$t('aboutThanksLi1A2Href')">{{ $t('aboutThanksLi1A2Text') }}</a>.
          </li>
          <li class="about-li">
            <a :href="$t('aboutThanksLi2A1Href')">{{ $t('aboutThanksLi2A1Text') }}</a>
            {{ $t('aboutThanksLi2Text1') }}
            <a :href="$t('aboutThanksLi2A2Href')">{{ $t('aboutThanksLi2A2Text') }}</a>{{ $t('aboutThanksLi2Text2') }}
            <a :href="$t('aboutThanksLi2A3Href')">{{ $t('aboutThanksLi2A3Text') }}</a>.
          </li>
          <li class="about-li">{{ $t('aboutThanksLi3Text') }}</li>
        </ul>
      </div>
    </div>
    <hr />
    <div class="text-bold">
      {{ $t('aboutAppLicense') }}
      <a :href="$t('aboutAppLicenseHref')">{{ $t('aboutAppLicenseText') }}</a>.
    </div>
  </q-page>
</template>

<script>
export default {
  // name: 'PageName',
}
</script>
