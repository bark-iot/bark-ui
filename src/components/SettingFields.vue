<template>
  <div>
    <div v-for="(field, index) in value">
      <v-text-field
        label="Key"
        :value="field.key"
        ref="fieldKeys"
        @input="updateFieldKey(index)"
      ></v-text-field>
      <v-text-field
        label="Val"
        :value="field.val"
        ref="fieldVals"
        @input="updateFieldVal(index)"
      ></v-text-field>
      <v-btn flat icon color="red" @click="remove(index)">
        <v-icon>delete</v-icon>
      </v-btn>
    </div>
    <v-btn @click="add">Add Field</v-btn>
  </div>
</template>

<script>
  export default {
    props: ['value'],
    data() {
      return {
        fields: []
      }
    },
    methods: {
      updateFieldKey(index) {
        var copy = this.value.slice();
        copy[index]["key"] = this.$refs.fieldKeys[index].inputValue;
        this.$emit('input', copy);
      },
      updateFieldVal(index) {
        var copy = this.value.slice();
        copy[index].val = this.$refs.fieldVals[index].inputValue;
        this.$emit('input', copy);
      },
      add() {
        this.$emit('add', {key: "", val: ""})
      },
      remove(index) {
        this.$emit('remove', index)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
