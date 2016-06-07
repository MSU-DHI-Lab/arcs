<div class="tab-pane" id="collections-tab">
<!-- pre>
<?php //print_r($user_info);//var_dump($user_info); ?>
</pre -->
<?php if (empty($user_info['Collection'])): ?>
    <h4>No collections</h4>
<?php else: ?>
    <table class="user-tabs-table">
        <!-- <thead>
            <tr>
                <th class="user-tabs-header">Public?</th>
                <th class="user-tabs-header">Title</th>
                <th class="user-tabs-header">Description</th>
                <th class="user-tabs-header">Date</th>
            </tr> -->
        </thead>
        <tbody>
        <!-- ?php if ($collection['temporary'] == 1) continue ?>
                    <tr>
                        <td>
                        <?php if ($collection['public']): ?>
                            <span class="label success">Public</span>
                        <?php else: ?>
                            <span class="label info">Private</span>
                        <?php endif ?>
                        <td>
                        <?php echo $this->Html->link($collection[0]['title'],
                            '/collection/' . $collection['title']) ?>
                        </td>
                        <td><?php echo $collection['description'] ?></td>
                        <td><?php echo $collection['created'] ?></td>
                        <td><?php echo "hello" ?></td>
                    </tr> -->

        <?php $url = $this->Html->url(array('action' => 'view', $r['Resource']['id']));
                              $url = substr($url,1,-10);
                              $url = KORA_BASE.$url."resource/"?>

        <div class="profile-collection-list-wrapper">
        <div class="collection-list" id="all-collections">

            <?php foreach($user_info['Collection'] as $collection): ?>
                <details class="closed" data-id="<?php echo $collection['id'] ?>">

                    <summary>
                        <div class="btn-view-collection">
                            <h3><?php echo $collection['title']; ?></h3>
                            <h4></h4>
                            <h5><?php echo $collection['date']; ?></h5>
                        </div>
                        <div class="btn-view-all-collection">
                            <h3>VIEW COLLECTION</h3>
                        </div>
                    </summary>

                    <div class="results">
                        <!-- ul class="resource-thumbs">
                            <?php foreach( $collection as $resource ): ?>

                                    <li class="resource-thumb">
                                        <a href="<?php echo $url.$resource['id'] ?>">
                                            <img src="<?php echo $resource['thumb'] ?>" alt="resource" >
                                        </a>
                                        <a class="subtle" href="<?php echo $url.$resource['id'] ?>">
                                            <?php echo $resource['title'] ?><br /><?php echo $resource['type'] ?>
                                        </a>
                                    </li>

                            <?php endforeach; ?>
                        </ul -->
                    </div>

                </details>
            <?php endforeach; ?>
        </div>
        </div>
        </tbody>
    </table>
<?php endif; ?>
</div>
