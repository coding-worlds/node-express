<template>
  <div>
    <Modal width="1400px" v-model="isShowMedal" title="BUG列表" @on-ok="ok" @on-cancel="cancel">
      <BugTitle :detailsList="detailsList"></BugTitle>
    </Modal>
  </div>
</template>
<script>
  import BugTitle from './BugTitle.vue'
  export default {
    components: {
      BugTitle
    },
    props: {
      isShow: { type: Boolean },
      detailsList: { type: Array }
    },
    watch: {
      isShow(newVal) {
        this.isShowMedal = newVal
      }
    },
    data () {
      return {
        isShowMedal: false
      }
    },
    methods: {
      ok() {
        this.$emit('getPoints', false)
      },
      cancel() {
        this.$emit('getPoints', false)
      }
    }
  }
</script>