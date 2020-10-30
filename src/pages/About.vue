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
        <ul>
          <li class="about-li">{{ $t('aboutP3_1') }}</li>
          <li class="about-li">{{ $t('aboutP3_2') }}</li>
          <li class="about-li">{{ $t('aboutP3_3') }}</li>
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
