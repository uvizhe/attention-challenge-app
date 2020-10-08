<template>
  <q-page padding>
    <div class="text-justify">
      <p>
        {{ $t('aboutGreeting') }}, <strong>{{ $store.state.app.username }}</strong>!<br/>
        {{ $t('aboutP1') }}
      </p>
      <p>
        {{ $t('aboutP2') }}
      </p>
      <p>
        {{ $t('aboutP3') }}
      </p>
      <p>
        {{ $t('aboutP4') }}
      </p>
      <p>
        {{ $t('aboutP5') }}
        <ul>
          <li class="about-li">{{ $t('aboutP5_1') }}</li>
          <li class="about-li">{{ $t('aboutP5_2') }}</li>
          <li class="about-li">{{ $t('aboutP5_3') }}</li>
        </ul>
      </p>
    </div>
  </q-page>
</template>

<script>
export default {
  // name: 'PageName',
}
</script>
